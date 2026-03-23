import { api, queryKeys } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'
import type { ItemCard, UseItemsParams } from './types'

interface ItemsGetOut {
  items: ItemCard[]
  total: number
}

interface FetchItemsParams {
  categories?: string
  limit?: number
  needsRevision?: true
  q?: string
  skip?: number
}

const fetchItems = async (params?: FetchItemsParams): Promise<ItemsGetOut> => {
  const { data } = await api.get<ItemsGetOut>('/items', {
    params,
  })

  return data
}

export function useItems(params?: UseItemsParams) {
  const normalizedParams: FetchItemsParams = {
    categories: params?.categories?.length
      ? [...params.categories].sort().join(',')
      : undefined,
    limit: params?.limit,
    needsRevision: params?.needsRevision,
    q: params?.q,
    skip: params?.skip,
  }

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.items(normalizedParams),
    queryFn: () => fetchItems(normalizedParams),
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
