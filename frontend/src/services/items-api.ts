import type {
  ItemCard,
  ItemDetails,
  ItemSortColumn,
  SortDirection,
} from '@/shared/types/item'
import { api } from './api'

export interface GetItemsOut {
  items: ItemCard[]
  total: number
}

export interface GetItemsParams {
  categories?: string
  limit?: number
  needsRevision?: true
  q?: string
  sortColumn?: ItemSortColumn
  sortDirection?: SortDirection
  skip?: number
}

export const getItems = async (params?: GetItemsParams): Promise<GetItemsOut> => {
  const { data } = await api.get<GetItemsOut>('/items', { params })

  return data
}

export const getItemById = async (id: string): Promise<ItemDetails> => {
  const { data } = await api.get<ItemDetails>(`/items/${id}`)

  return data
}
