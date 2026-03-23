import Fastify from 'fastify';
import { treeifyError, ZodError } from 'zod';

import items from 'data/items.json' with { type: 'json' };
import { getItemsResponse } from './src/items-service.ts';
import type { Item } from './src/types.ts';
import { doesItemNeedRevision } from './src/utils.ts';
import { ItemUpdateInSchema, ItemsGetInQuerySchema } from './src/validation.ts';

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register((await import('@fastify/middie')).default);

// Artificial delay to test loading states on client side.
fastify.use((_, __, next) =>
  new Promise(res => setTimeout(res, 300 + Math.random() * 700)).then(next),
);

fastify.use((_, reply, next) => {
  reply.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

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

const port = Number(process.env.PORT || 8080);

fastify.listen({ port }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`Server is listening on port ${port}`);
});
