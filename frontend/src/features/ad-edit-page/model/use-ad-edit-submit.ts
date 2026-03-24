import { updateItemById } from '@/services'
import { queryKeys } from '@/shared/lib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AdEditFormValues } from '../schema'
import { mapAdEditFormValuesToUpdateItemIn } from './map-form-to-payload'

export function useAdEditSubmit(itemId?: string) {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: AdEditFormValues }) =>
      updateItemById(id, mapAdEditFormValuesToUpdateItemIn(values)),
  })

  const submit = async (values: AdEditFormValues) => {
    if (!itemId) {
      return
    }

    await mutateAsync({
      id: itemId,
      values,
    })

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.items() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.item(itemId) }),
    ])
  }

  return {
    isPending,
    submit,
  }
}
