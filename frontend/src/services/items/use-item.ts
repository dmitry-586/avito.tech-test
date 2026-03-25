import { queryKeys } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'
import { getItemById } from './api'

export function useItem(id?: string) {
  const itemId = id?.trim() ?? ''
  const isEnabled = itemId.length > 0

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.item(itemId),
    queryFn: ({ signal }) => getItemById(itemId, { signal }),
    enabled: isEnabled,
  })

  return {
    error,
    isLoading,
    item: data ?? null,
  }
}
