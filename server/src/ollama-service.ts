import { z } from 'zod'
import {
	buildImproveDescriptionPrompt,
	buildSuggestPricePrompt
} from './ai-prompts.ts'
import {
	ImproveDescriptionInSchema,
	ImproveDescriptionOutSchema,
	SuggestPriceInSchema,
	SuggestPriceOutSchema,
	type ImproveDescriptionInput,
	type ImproveDescriptionOutput,
	type SuggestPriceInput,
	type SuggestPriceOutput
} from './validation.ts'

const OLLAMA_URL =
	process.env.OLLAMA_URL?.trim() || 'http://127.0.0.1:11434/api/generate'
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 30_000)
const OLLAMA_MODEL = process.env.OLLAMA_MODEL?.trim() || 'llama3'

const OllamaGenerateResponseSchema = z.looseObject({
	response: z.string().optional(),
	error: z.string().optional()
})

export class OllamaServiceError extends Error {
	readonly statusCode: number

	constructor(
		statusCode: number,
		message: string,
		options?: { cause?: unknown }
	) {
		super(message, options)
		this.name = 'OllamaServiceError'
		this.statusCode = statusCode
	}
}

const formatZodError = (error: z.ZodError): string =>
	error.issues
		.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`)
		.join('; ')

const parseWithSchema = <T>(
	schema: z.ZodType<T>,
	payload: unknown,
	errorPrefix: string
): T => {
	const parsed = schema.safeParse(payload)

	if (!parsed.success) {
		throw new OllamaServiceError(
			502,
			`${errorPrefix}: ${formatZodError(parsed.error)}`
		)
	}

	return parsed.data
}

const parseModelJson = (rawModelResponse: string): unknown => {
	try {
		return JSON.parse(rawModelResponse)
	} catch {
		throw new OllamaServiceError(
			502,
			'Ollama returned malformed JSON in response field'
		)
	}
}

const generateFromOllama = async (prompt: string): Promise<unknown> => {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS)

	let response: Response

	try {
		response = await fetch(OLLAMA_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				prompt,
				stream: false
			}),
			signal: controller.signal
		})
	} catch (error) {
		if (controller.signal.aborted) {
			throw new OllamaServiceError(
				504,
				'Ollama request timed out after 30 seconds',
				{
					cause: error
				}
			)
		}

		throw new OllamaServiceError(
			502,
			'Failed to connect to Ollama at http://127.0.0.1:11434. Check that Ollama is running',
			{ cause: error }
		)
	} finally {
		clearTimeout(timeout)
	}

	if (!response.ok) {
		const details = await response.text().catch(() => '')
		const tail = details ? `: ${details.slice(0, 300)}` : ''
		throw new OllamaServiceError(
			502,
			`Ollama returned HTTP ${response.status}${tail}`
		)
	}

	let payload: unknown
	try {
		payload = await response.json()
	} catch {
		throw new OllamaServiceError(502, 'Ollama returned non-JSON payload')
	}

	const parsedPayload = parseWithSchema(
		OllamaGenerateResponseSchema,
		payload,
		'Ollama payload does not match expected format'
	)

	if (parsedPayload.error) {
		throw new OllamaServiceError(
			502,
			`Ollama returned error: ${parsedPayload.error}`
		)
	}

	if (!parsedPayload.response) {
		throw new OllamaServiceError(
			502,
			'Ollama response field is missing or empty'
		)
	}

	return parseModelJson(parsedPayload.response.trim())
}

export const improveDescription = async (
	input: ImproveDescriptionInput
): Promise<ImproveDescriptionOutput> => {
	const parsedInput = ImproveDescriptionInSchema.parse(input)
	const modelResult = await generateFromOllama(
		buildImproveDescriptionPrompt(parsedInput)
	)
	return parseWithSchema(
		ImproveDescriptionOutSchema,
		modelResult,
		'Ollama returned invalid improve-description JSON'
	)
}

export const suggestPrice = async (
	input: SuggestPriceInput
): Promise<SuggestPriceOutput> => {
	const parsedInput = SuggestPriceInSchema.parse(input)
	const modelResult = await generateFromOllama(
		buildSuggestPricePrompt(parsedInput)
	)
	return parseWithSchema(
		SuggestPriceOutSchema,
		modelResult,
		'Ollama returned invalid suggest-price JSON'
	)
}
