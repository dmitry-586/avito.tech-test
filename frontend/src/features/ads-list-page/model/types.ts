import type {
  ItemCard,
  ItemCategory,
  ItemSortColumn,
  SortDirection,
} from '@/shared/types'

export type CardsViewVariant = 'default' | 'full-width'

export interface ItemsFilters {
  categories: ItemCategory[]
  needsRevisionOnly: boolean
}

export interface UseItemsParams {
  categories?: ItemCategory[]
  limit?: number
  needsRevision?: true
  q?: string
  sortColumn?: ItemSortColumn
  sortDirection?: SortDirection
  skip?: number
}

export type SortValue =
  | 'title-asc'
  | 'title-desc'
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'price-asc'
  | 'price-desc'

export interface SortOption {
  label: string
  value: SortValue
}

export type { ItemCard, ItemCategory, ItemSortColumn, SortDirection }
