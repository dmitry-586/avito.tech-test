import { getItems, type GetItemsParams } from '@/services'
import { queryKeys } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'
import type { UseItemsParams } from './types'

export function useItems(params?: UseItemsParams) {
  const normalizedParams: GetItemsParams = {
    categories: params?.categories?.length
      ? [...params.categories].sort().join(',')
      : undefined,
    limit: params?.limit,
    needsRevision: params?.needsRevision,
    q: params?.q,
    sortColumn: params?.sortColumn,
    sortDirection: params?.sortDirection,
    skip: params?.skip,
  }

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.items(normalizedParams),
    queryFn: () => getItems(normalizedParams),
  })

  const items = data?.items ?? []
  const limitedItems =
    params?.limit != null ? items.slice(0, params.limit) : items

  return {
    error,
    isFetching,
    isLoading,
    items: limitedItems,
    total: data?.total ?? 0,
  }
}
