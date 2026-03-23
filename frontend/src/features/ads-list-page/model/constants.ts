import type {
  CardsViewVariant,
  ItemCategory,
  ItemsFilters,
  SortOption,
} from './types'

export const DEFAULT_VIEW_VARIANT: CardsViewVariant = 'default'
export const ITEMS_PER_PAGE = 10

export const INITIAL_FILTERS: ItemsFilters = {
  categories: [],
  needsRevisionOnly: false,
}

export const CATEGORY_OPTIONS: ReadonlyArray<readonly [ItemCategory, string]> =
  [
    ['auto', 'Авто'],
    ['electronics', 'Электроника'],
    ['real_estate', 'Недвижимость'],
  ]

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  auto: 'Авто',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

export const SORT_OPTIONS: ReadonlyArray<SortOption> = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price-asc', label: 'Цена по возрастанию' },
  { value: 'price-desc', label: 'Цена по убыванию' },
]
