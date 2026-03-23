export type CardsViewVariant = 'default' | 'full-width'

export type ItemCategory = 'auto' | 'electronics' | 'real_estate'

export interface ItemCard {
  id: number | string
  category: ItemCategory
  needsRevision: boolean
  price: number
  title: string
}

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

export type ItemSortColumn = 'title' | 'createdAt' | 'price'

export type SortDirection = 'asc' | 'desc'

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
