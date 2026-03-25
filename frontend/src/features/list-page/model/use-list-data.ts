import { useDebouncedValue } from '@mantine/hooks'

import { getSortQueryParams, ITEMS_PER_PAGE } from './constants'
import { useListDataStore } from './selectors'
import { useItems } from './use-items'

export function useListData() {
  const { categories, needsRevisionOnly, page, searchQuery, sortValue } =
    useListDataStore()

  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const normalizedQuery = debouncedSearchQuery.trim() || undefined
  const { sortColumn, sortDirection } = getSortQueryParams(sortValue)

  return useItems({
    categories,
    limit: ITEMS_PER_PAGE,
    needsRevision: needsRevisionOnly || undefined,
    q: normalizedQuery,
    sortColumn,
    sortDirection,
    skip: (page - 1) * ITEMS_PER_PAGE,
  })
}
