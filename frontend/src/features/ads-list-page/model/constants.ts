import type {
  CardsViewVariant,
  ItemCategory,
  ItemSortColumn,
  ItemsFilters,
  SortDirection,
  SortOption,
  SortValue,
} from './types'

export const DEFAULT_VIEW_VARIANT: CardsViewVariant = 'default'
export const ITEMS_PER_PAGE = 10
export const DEFAULT_SORT_VALUE: SortValue = 'createdAt-desc'

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
  { value: 'title-asc', label: 'Название: А → Я' },
  { value: 'title-desc', label: 'Название: Я → А' },
  { value: 'createdAt-desc', label: 'Новизна: сначала новые' },
  { value: 'createdAt-asc', label: 'Новизна: сначала старые' },
  { value: 'price-asc', label: 'Цена: сначала дешевле' },
  { value: 'price-desc', label: 'Цена: сначала дороже' },
]

export const SORT_VALUE_TO_QUERY_PARAMS: Record<
  SortValue,
  {
    sortColumn: ItemSortColumn
    sortDirection: SortDirection
  }
> = {
  'title-asc': { sortColumn: 'title', sortDirection: 'asc' },
  'title-desc': { sortColumn: 'title', sortDirection: 'desc' },
  'createdAt-desc': { sortColumn: 'createdAt', sortDirection: 'desc' },
  'createdAt-asc': { sortColumn: 'createdAt', sortDirection: 'asc' },
  'price-asc': { sortColumn: 'price', sortDirection: 'asc' },
  'price-desc': { sortColumn: 'price', sortDirection: 'desc' },
}
