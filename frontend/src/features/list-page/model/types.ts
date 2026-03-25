import type {
  ItemCard,
  ItemCategory,
  ItemListQueryBase,
} from '@/shared/types'
import type { SortValue as ListSortValue } from './constants'

export type ViewVariant = 'default' | 'full-width'

export interface ItemsFilters {
  categories: ItemCategory[]
  needsRevisionOnly: boolean
}

export interface UseItemsParams extends ItemListQueryBase {
  categories?: ItemCategory[]
}

export type SortValue = ListSortValue

export type { ItemCard, ItemCategory }
