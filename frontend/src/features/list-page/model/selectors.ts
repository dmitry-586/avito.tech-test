import { useShallow } from 'zustand/react/shallow'
import { useListPageStore } from './store'

export function useFilterStore() {
  return useListPageStore(
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

export function useHeaderStore() {
  return useListPageStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setSortValue: state.setSortValue,
      setViewVariant: state.setViewVariant,
      sortValue: state.sortValue,
      viewVariant: state.viewVariant,
    })),
  )
}

export function useListStore() {
  return useListPageStore(
    useShallow((state) => ({
      page: state.page,
      setPage: state.setPage,
      viewVariant: state.viewVariant,
    })),
  )
}

export function useListDataStore() {
  return useListPageStore(
    useShallow((state) => ({
      categories: state.filters.categories,
      needsRevisionOnly: state.filters.needsRevisionOnly,
      page: state.page,
      searchQuery: state.searchQuery,
      sortValue: state.sortValue,
    })),
  )
}
