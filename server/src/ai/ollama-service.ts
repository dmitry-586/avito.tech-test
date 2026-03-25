import {
	ImproveDescriptionInSchema,
	SuggestPriceInSchema,
	type ImproveDescriptionInput,
	type ImproveDescriptionOutput,
	type SuggestPriceInput,
	type SuggestPriceOutput
} from '../validation.ts'
import { getMarketResearchContext } from '../web-search-service.ts'
import { generateImproveDescription } from './improve-description-flow.ts'
import { OllamaServiceError } from './ollama-core.ts'
import { generateSuggestPrice } from './suggest-price-flow.ts'

export { OllamaServiceError }

export const improveDescription = async (
	input: ImproveDescriptionInput
): Promise<ImproveDescriptionOutput> => {
	const parsedInput = ImproveDescriptionInSchema.parse(input)
	return generateImproveDescription(parsedInput)
}

export const suggestPrice = async (
	input: SuggestPriceInput
): Promise<SuggestPriceOutput> => {
	const parsedInput = SuggestPriceInSchema.parse(input)
	const marketResearch = await getMarketResearchContext(parsedInput)
	return generateSuggestPrice(parsedInput, marketResearch)
}
