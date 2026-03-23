import { useShallow } from 'zustand/react/shallow'

import { useAdsListPageStore } from './store'

export function useCardsFilterStore() {
  return useAdsListPageStore(
    useShallow((state) => ({
      categories: state.filters.categories,
      isCategoriesOpen: state.isCategoriesOpen,
      needsRevisionOnly: state.filters.needsRevisionOnly,
      resetFilters: state.resetFilters,
      setCategoryChecked: state.setCategoryChecked,
      setNeedsRevisionOnly: state.setNeedsRevisionOnly,
      toggleCategories: state.toggleCategories,
    })),
  )
}

export function useCardsHeaderStore() {
  return useAdsListPageStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setViewVariant: state.setViewVariant,
      viewVariant: state.viewVariant,
    })),
  )
}

export function useCardsListStore() {
  return useAdsListPageStore(
    useShallow((state) => ({
      page: state.page,
      setPage: state.setPage,
      viewVariant: state.viewVariant,
    })),
  )
}
