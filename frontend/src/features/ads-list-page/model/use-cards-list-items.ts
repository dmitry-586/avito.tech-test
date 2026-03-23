import { useShallow } from 'zustand/react/shallow'

import { ITEMS_PER_PAGE, SORT_VALUE_TO_QUERY_PARAMS } from './constants'
import { useAdsListPageStore } from './store'
import { useItems } from './use-items'

export function useCardsListItems() {
  const { filters, page, searchQuery, sortValue } = useAdsListPageStore(
    useShallow((state) => ({
      filters: state.filters,
      page: state.page,
      searchQuery: state.searchQuery,
      sortValue: state.sortValue,
    })),
  )
  const normalizedSearchQuery = searchQuery.trim() || undefined
  const { sortColumn, sortDirection } = SORT_VALUE_TO_QUERY_PARAMS[sortValue]

  return useItems({
    categories: filters.categories,
    limit: ITEMS_PER_PAGE,
    needsRevision: filters.needsRevisionOnly ? true : undefined,
    q: normalizedSearchQuery,
    sortColumn,
    sortDirection,
    skip: (page - 1) * ITEMS_PER_PAGE,
  })
}
