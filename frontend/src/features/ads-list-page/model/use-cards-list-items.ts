import { useShallow } from 'zustand/react/shallow'

import { ITEMS_PER_PAGE } from './constants'
import { useAdsListPageStore } from './store'
import { useItems } from './use-items'

export function useCardsListItems() {
  const { filters, page, searchQuery } = useAdsListPageStore(
    useShallow((state) => ({
      filters: state.filters,
      page: state.page,
      searchQuery: state.searchQuery,
    })),
  )
  const normalizedSearchQuery = searchQuery.trim() || undefined

  return useItems({
    categories: filters.categories,
    limit: ITEMS_PER_PAGE,
    needsRevision: filters.needsRevisionOnly ? true : undefined,
    q: normalizedSearchQuery,
    skip: (page - 1) * ITEMS_PER_PAGE,
  })
}
