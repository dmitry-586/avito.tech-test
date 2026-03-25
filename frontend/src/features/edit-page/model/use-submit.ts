import { updateItemById } from '@/services'
import { queryKeys, useAbortController } from '@/shared/lib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { EditFormValues } from '../config'
import { useEditDraftStore } from './draft-store'
import { mapFormToUpdatePayload } from './mappers'

export function useEditSubmit(itemId?: string) {
  const queryClient = useQueryClient()
  const { nextSignal } = useAbortController()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: EditFormValues }) => {
      return updateItemById(id, mapFormToUpdatePayload(values), {
        signal: nextSignal(),
      })
    },
  })

  const submit = async (values: EditFormValues) => {
    if (!itemId) {
      return
    }

    await mutateAsync({
      id: itemId,
      values,
    })

    useEditDraftStore.getState().clearDraft(itemId)

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
