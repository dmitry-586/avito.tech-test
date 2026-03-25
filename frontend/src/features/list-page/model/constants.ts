import type { ItemSortColumn, SelectOption, SortDirection } from '@/shared/types'
import type { ItemsFilters, ViewVariant } from './types'

type SortConfigEntry = {
  label: string
  sortColumn: ItemSortColumn
  sortDirection: SortDirection
}

const SORT_CONFIG = {
  'title-asc': {
    label: 'Название: А → Я',
    sortColumn: 'title',
    sortDirection: 'asc',
  },
  'title-desc': {
    label: 'Название: Я → А',
    sortColumn: 'title',
    sortDirection: 'desc',
  },
  'createdAt-desc': {
    label: 'Новизна: сначала новые',
    sortColumn: 'createdAt',
    sortDirection: 'desc',
  },
  'createdAt-asc': {
    label: 'Новизна: сначала старые',
    sortColumn: 'createdAt',
    sortDirection: 'asc',
  },
  'price-asc': {
    label: 'Цена: сначала дешевле',
    sortColumn: 'price',
    sortDirection: 'asc',
  },
  'price-desc': {
    label: 'Цена: сначала дороже',
    sortColumn: 'price',
    sortDirection: 'desc',
  },
} as const satisfies Record<string, SortConfigEntry>

export type SortValue = keyof typeof SORT_CONFIG

export const DEFAULT_VIEW_VARIANT: ViewVariant = 'default'
export const ITEMS_PER_PAGE = 10
export const DEFAULT_SORT_VALUE: SortValue = 'createdAt-desc'

export const INITIAL_FILTERS: ItemsFilters = {
  categories: [],
  needsRevisionOnly: false,
}

export const SORT_OPTIONS: ReadonlyArray<SelectOption<SortValue>> = (
  Object.entries(SORT_CONFIG) as Array<[SortValue, (typeof SORT_CONFIG)[SortValue]]>
).map(([value, { label }]) => ({
  label,
  value,
}))

export function getSortQueryParams(sortValue: SortValue): {
  sortColumn: ItemSortColumn
  sortDirection: SortDirection
} {
  const { sortColumn, sortDirection } = SORT_CONFIG[sortValue]

  return { sortColumn, sortDirection }
}
