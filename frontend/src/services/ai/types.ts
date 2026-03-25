import type {
  AutoItemParams,
  ElectronicsItemParams,
  RealEstateItemParams,
} from '@/shared/types'

type AiInputBase = {
  description?: string
  price?: number | null
  title: string
}

type AiCategoryPayload =
  | { category: 'auto'; params: Partial<AutoItemParams> }
  | { category: 'real_estate'; params: Partial<RealEstateItemParams> }
  | { category: 'electronics'; params: Partial<ElectronicsItemParams> }

export type AiEndpointIn = AiInputBase & AiCategoryPayload

export interface AiEndpointOut {
  message: string
}

export interface SuggestPriceOut extends AiEndpointOut {
  price: number
}
