import Fastify, { type FastifyReply } from 'fastify';
import { treeifyError, ZodError } from 'zod';
import fastifyCors from '@fastify/cors';

import items from 'data/items.json' with { type: 'json' };
import { getItemsResponse } from './src/items-service.ts';
import {
  improveDescription,
  OllamaServiceError,
  suggestPrice,
} from './src/ollama-service.ts';
import type { Item } from './src/types.ts';
import { doesItemNeedRevision } from './src/utils.ts';
import {
  ImproveDescriptionInSchema,
  ItemUpdateInSchema,
  ItemsGetInQuerySchema,
  SuggestPriceInSchema,
} from './src/validation.ts';

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register((await import('@fastify/middie')).default);
await fastify.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
});

// Artificial delay to test loading states on client side.
fastify.use((_, __, next) =>
  new Promise(res => setTimeout(res, 300 + Math.random() * 700)).then(next),
);

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.get<ItemGetRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const item = ITEMS.find(entry => entry.id === itemId);

  if (!item) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
    sortColumn?: string;
    sortDirection?: string;
  };
}

fastify.get<ItemsGetRequest>('/items', request => {
  const parsedQuery = ItemsGetInQuerySchema.parse(request.query);
  return getItemsResponse(ITEMS, parsedQuery);
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

interface AiRequest extends Fastify.RequestGenericInterface {
  Body: unknown;
}

const handleAiRequest = async <T>(
  reply: FastifyReply,
  requestHandler: () => Promise<T> | T,
): Promise<T | void> => {
  try {
    return await requestHandler();
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    if (error instanceof OllamaServiceError) {
      reply.status(error.statusCode).send({ success: false, error: error.message });
      return;
    }

    throw error;
  }
};

fastify.put<ItemUpdateRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const itemIndex = ITEMS.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  try {
    const parsedData = ItemUpdateInSchema.parse({
      category: ITEMS[itemIndex].category,
      ...(request.body as {}),
    });

    ITEMS[itemIndex] = {
      id: ITEMS[itemIndex].id,
      createdAt: ITEMS[itemIndex].createdAt,
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    throw error;
  }
});

fastify.post<AiRequest>('/ai/improve-description', async (request, reply) =>
  handleAiRequest(reply, async () => {
    const parsedBody = ImproveDescriptionInSchema.parse(request.body);
    return improveDescription(parsedBody);
  }),
);

fastify.post<AiRequest>('/ai/suggest-price', async (request, reply) =>
  handleAiRequest(reply, async () => {
    const parsedBody = SuggestPriceInSchema.parse(request.body);
    return suggestPrice(parsedBody);
  }),
);

const port = Number(process.env.PORT || 8080);
const host = process.env.HOST?.trim() || '0.0.0.0';

fastify.listen({ port, host }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`Server is listening on port ${port}`);
});
