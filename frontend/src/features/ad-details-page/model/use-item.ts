import { getItemById } from '@/services/items-api'
import { queryKeys } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'

export function useItem(id?: string) {
  const normalizedId = id?.trim()

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.item(normalizedId),
    queryFn: async () => {
      if (!normalizedId) {
        throw new Error('Item id is required')
      }

      return getItemById(normalizedId)
    },
    enabled: Boolean(normalizedId),
  })

  return {
    error,
    isFetching,
    isLoading,
    item: data ?? null,
  }
}
