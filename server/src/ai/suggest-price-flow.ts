import { buildSuggestPricePrompt } from '../ai-prompts.ts';
import type { SuggestPriceInput, SuggestPriceOutput } from '../validation.ts';
import type { MarketResearchContext } from '../web-search-service.ts';
import { generateMessage } from './ollama-core.ts';

export const generateSuggestPrice = async (
  input: SuggestPriceInput,
  marketResearch: MarketResearchContext | null,
): Promise<SuggestPriceOutput> => {
  return { message: await generateMessage(buildSuggestPricePrompt(input, marketResearch)) };
};
