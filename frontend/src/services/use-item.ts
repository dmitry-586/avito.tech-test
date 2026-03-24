import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib'
import { getItemById } from './items-api'

export function useItem(id?: string) {
  const itemId = id?.trim() ?? ''
  const isEnabled = itemId.length > 0

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.item(itemId),
    queryFn: () => getItemById(itemId),
    enabled: isEnabled,
  })

  return {
    error,
    isLoading,
    item: data ?? null,
  }
}
