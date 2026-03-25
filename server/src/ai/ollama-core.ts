import { z } from 'zod';

const OLLAMA_URL =
  process.env.OLLAMA_URL?.trim() || 'http://127.0.0.1:11434/api/generate';
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 30_000);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL?.trim() || 'llama3';
const OLLAMA_TEMPERATURE = Number(process.env.OLLAMA_TEMPERATURE ?? 0.1);

const OllamaGenerateResponseSchema = z.looseObject({
  response: z.string().optional(),
  error: z.string().optional(),
});

export class OllamaServiceError extends Error {
  readonly statusCode: number;

  constructor(
    statusCode: number,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'OllamaServiceError';
    this.statusCode = statusCode;
  }
}

const formatZodError = (error: z.ZodError): string =>
  error.issues
    .map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join('; ');

const parseWithSchema = <T>(
  schema: z.ZodType<T>,
  payload: unknown,
  errorPrefix: string,
): T => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new OllamaServiceError(502, `${errorPrefix}: ${formatZodError(parsed.error)}`);
  }

  return parsed.data;
};

const tryParseJson = (value: string): unknown | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const extractJsonObjectCandidate = (raw: string): string | null => {
  const fencedMatch = raw.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = raw.indexOf('{');
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < raw.length; i += 1) {
    const char = raw[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(firstBrace, i + 1).trim();
      }
    }
  }

  return null;
};

const parseModelJson = (rawModelResponse: string): unknown => {
  const direct = tryParseJson(rawModelResponse);
  if (direct !== null) {
    return direct;
  }

  const candidate = extractJsonObjectCandidate(rawModelResponse);
  if (candidate) {
    const recovered = tryParseJson(candidate);
    if (recovered !== null) {
      return recovered;
    }
  }

  const plain = rawModelResponse
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  if (plain.length > 0) {
    return { message: plain };
  }

  throw new OllamaServiceError(502, 'Ollama returned malformed JSON in response field');
};

const generateFromOllama = async (prompt: string): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: OLLAMA_TEMPERATURE,
        },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new OllamaServiceError(
        504,
        `Ollama request timed out after ${Math.round(OLLAMA_TIMEOUT_MS / 1000)} seconds`,
        { cause: error },
      );
    }

    throw new OllamaServiceError(
      502,
      'Failed to connect to Ollama at http://127.0.0.1:11434. Check that Ollama is running',
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    const tail = details ? `: ${details.slice(0, 300)}` : '';
    throw new OllamaServiceError(502, `Ollama returned HTTP ${response.status}${tail}`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new OllamaServiceError(502, 'Ollama returned non-JSON payload');
  }

  const parsedPayload = parseWithSchema(
    OllamaGenerateResponseSchema,
    payload,
    'Ollama payload does not match expected format',
  );

  if (parsedPayload.error) {
    throw new OllamaServiceError(502, `Ollama returned error: ${parsedPayload.error}`);
  }

  if (!parsedPayload.response) {
    throw new OllamaServiceError(502, 'Ollama response field is missing or empty');
  }

  return parseModelJson(parsedPayload.response.trim());
};

export const generateStrictJson = async (prompt: string): Promise<unknown> => {
  try {
    return await generateFromOllama(prompt);
  } catch (error) {
    if (
      error instanceof OllamaServiceError &&
      error.message.includes('malformed JSON')
    ) {
      return generateFromOllama(
        `${prompt}\n\nIMPORTANT: Return exactly one valid JSON object in format {"message":"..."} and nothing else.`,
      );
    }

    throw error;
  }
};

const normalizeMessagePayload = (payload: unknown): unknown => {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return payload;
  }

  if (typeof (payload as { message?: unknown }).message === 'string') {
    const rawMessage = (payload as { message: string }).message.trim();

    if (rawMessage.includes('"message"')) {
      const candidate = extractJsonObjectCandidate(rawMessage) ?? rawMessage;
      const nested = tryParseJson(candidate);
      if (
        nested &&
        typeof nested === 'object' &&
        !Array.isArray(nested) &&
        typeof (nested as { message?: unknown }).message === 'string'
      ) {
        return { message: (nested as { message: string }).message };
      }

      const match = rawMessage.match(/"message"\s*:\s*"([\s\S]*)"\s*}/);
      if (match?.[1]) {
        const unescaped = match[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .trim();

        if (unescaped) {
          return { message: unescaped };
        }
      }
    }

    return { message: rawMessage };
  }

  if (typeof (payload as { description?: unknown }).description === 'string') {
    return { message: (payload as { description: string }).description };
  }

  return payload;
};

export const extractMessage = (payload: unknown): string => {
  const normalized = normalizeMessagePayload(payload);

  if (typeof normalized === 'string') {
    const message = normalized.trim();
    if (message.length > 0) {
      return message;
    }
  }

  if (
    typeof normalized === 'object' &&
    normalized !== null &&
    !Array.isArray(normalized) &&
    typeof (normalized as { message?: unknown }).message === 'string'
  ) {
    const message = (normalized as { message: string }).message.trim();
    if (message.length > 0) {
      return message;
    }
  }

  if (normalized !== null && normalized !== undefined) {
    const fallback = String(normalized).trim();
    if (fallback.length > 0 && fallback !== '[object Object]') {
      return fallback;
    }
  }

  throw new OllamaServiceError(502, 'Ollama returned empty message');
};

export const generateMessage = async (prompt: string): Promise<string> =>
  extractMessage(await generateStrictJson(prompt));
