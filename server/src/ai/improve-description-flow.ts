import type {
	ImproveDescriptionInput,
	ImproveDescriptionOutput
} from '../validation.ts'
import { buildImproveDescriptionPrompt } from './ai-prompts.ts'
import { generateMessage } from './ollama-core.ts'

export const generateImproveDescription = async (
	input: ImproveDescriptionInput
): Promise<ImproveDescriptionOutput> => {
	return {
		message: await generateMessage(buildImproveDescriptionPrompt(input))
	}
}
