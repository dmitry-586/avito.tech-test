import { create } from 'zustand'

import {
  DEFAULT_SORT_VALUE,
  DEFAULT_VIEW_VARIANT,
  INITIAL_FILTERS,
} from './constants'
import type {
  CardsViewVariant,
  ItemCategory,
  ItemsFilters,
  SortValue,
} from './types'

interface AdsListPageStore {
  filters: ItemsFilters
  isCategoriesOpen: boolean
  page: number
  searchQuery: string
  sortValue: SortValue
  viewVariant: CardsViewVariant
  resetFilters: () => void
  setCategoryChecked: (category: ItemCategory, isChecked: boolean) => void
  setNeedsRevisionOnly: (isChecked: boolean) => void
  setPage: (nextPage: number) => void
  setSearchQuery: (searchQuery: string) => void
  setSortValue: (sortValue: SortValue) => void
  setViewVariant: (variant: CardsViewVariant) => void
  toggleCategories: () => void
}

export const useAdsListPageStore = create<AdsListPageStore>()((set) => ({
  filters: INITIAL_FILTERS,
  isCategoriesOpen: true,
  page: 1,
  searchQuery: '',
  sortValue: DEFAULT_SORT_VALUE,
  viewVariant: DEFAULT_VIEW_VARIANT,

  resetFilters: () =>
    set({
      filters: INITIAL_FILTERS,
      page: 1,
    }),

  setCategoryChecked: (category, isChecked) =>
    set((state) => {
      const categories = isChecked
        ? state.filters.categories.includes(category)
          ? state.filters.categories
          : [...state.filters.categories, category]
        : state.filters.categories.filter((value) => value !== category)

      return {
        filters: {
          ...state.filters,
          categories,
        },
        page: 1,
      }
    }),

  setNeedsRevisionOnly: (isChecked) =>
    set((state) => ({
      filters: {
        ...state.filters,
        needsRevisionOnly: isChecked,
      },
      page: 1,
    })),

  setPage: (nextPage) =>
    set({
      page: Math.max(1, nextPage),
    }),

  setSearchQuery: (searchQuery) =>
    set({
      page: 1,
      searchQuery,
    }),

  setSortValue: (sortValue) =>
    set({
      page: 1,
      sortValue,
    }),

  setViewVariant: (variant) =>
    set({
      viewVariant: variant,
    }),

  toggleCategories: () =>
    set((state) => ({
      isCategoriesOpen: !state.isCategoriesOpen,
    })),
}))
