import type { ItemId } from '@/shared/types'

export const queryKeys = {
  item: (id?: ItemId) => ['item', id] as const,
  items: <TParams>(params?: TParams) => {
    if (params === undefined) {
      return ['items'] as const
    }

    return ['items', params] as const
  },
}
