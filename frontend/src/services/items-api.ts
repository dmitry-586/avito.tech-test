import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCard,
  ItemCategory,
  ItemDetails,
  ItemSortColumn,
  RealEstateItemParams,
  SortDirection,
} from '@/shared/types'
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

export interface UpdateItemIn {
  category: ItemCategory
  title: string
  description?: string
  price: number
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams
}

export const getItems = async (
  params?: GetItemsParams,
): Promise<GetItemsOut> => {
  const { data } = await api.get<GetItemsOut>('/items', { params })

  return data
}

export const getItemById = async (id: string): Promise<ItemDetails> => {
  const { data } = await api.get<ItemDetails>(`/items/${id}`)

  return data
}

export const updateItemById = async (
  id: string,
  payload: UpdateItemIn,
): Promise<ItemDetails> => {
  const { data } = await api.put<ItemDetails>(`/items/${id}`, payload)

  return data
}
