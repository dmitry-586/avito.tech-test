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
  skip?: number
}

export interface SortOption {
  label: string
  value: string
}
