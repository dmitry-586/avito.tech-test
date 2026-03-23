import type { ItemId } from '@/shared/types/item'

export const queryKeys = {
  item: (id?: ItemId) => ['item', id] as const,
  items: <TParams>(params?: TParams) => ['items', params] as const,
}
