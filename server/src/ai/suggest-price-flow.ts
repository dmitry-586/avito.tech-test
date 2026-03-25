import type { SuggestPriceInput, SuggestPriceOutput } from '../validation.ts'
import type { MarketResearchContext } from '../web-search-service.ts'
import { buildSuggestPricePrompt } from './ai-prompts.ts'
import { generateMessage } from './ollama-core.ts'

const normalizePriceToken = (raw: string): string => {
	const digits = raw.replace(/[^\d]/g, '')
	return digits.length > 0 ? digits : ''
}

const extractRecommendedPrice = (
	message: string,
	input: SuggestPriceInput
): string => {
	const recommendedMatch = message.match(
		/Рекомендованная цена:\s*([\d\s\u00a0.,]+)\s*₽/i
	)
	if (recommendedMatch?.[1]) {
		const normalized = normalizePriceToken(recommendedMatch[1])
		if (normalized) {
			return normalized
		}
	}

	const anyRubMatch = message.match(/([\d\s\u00a0.,]+)\s*₽/)
	if (anyRubMatch?.[1]) {
		const normalized = normalizePriceToken(anyRubMatch[1])
		if (normalized) {
			return normalized
		}
	}

	if (typeof input.price === 'number' && Number.isFinite(input.price)) {
		return String(Math.round(input.price))
	}

	return '0'
}

export const generateSuggestPrice = async (
	input: SuggestPriceInput,
	marketResearch: MarketResearchContext | null
): Promise<SuggestPriceOutput> => {
	const message = await generateMessage(
		buildSuggestPricePrompt(input, marketResearch)
	)
	return {
		message,
		price: extractRecommendedPrice(message, input)
	}
}
