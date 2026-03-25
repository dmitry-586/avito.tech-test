import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCard,
  ItemDetails,
  ItemListQueryBase,
  RealEstateItemParams,
} from '@/shared/types'
import { api } from '../api'

interface GetItemsOut {
  items: ItemCard[]
  total: number
}

interface RequestOptions {
  signal?: AbortSignal
}

export interface GetItemsParams extends ItemListQueryBase {
  categories?: string
}

interface UpdateItemBase {
  description?: string
  price: number
  title: string
}

export type UpdateItemIn =
  | (UpdateItemBase & { category: 'auto'; params: AutoItemParams })
  | (UpdateItemBase & {
      category: 'real_estate'
      params: RealEstateItemParams
    })
  | (UpdateItemBase & {
      category: 'electronics'
      params: ElectronicsItemParams
    })

export const getItems = async (
  params?: GetItemsParams,
  options?: RequestOptions,
): Promise<GetItemsOut> => {
  const { data } = await api.get<GetItemsOut>('/items', {
    params,
    signal: options?.signal,
  })

  return data
}

export const getItemById = async (
  id: string,
  options?: RequestOptions,
): Promise<ItemDetails> => {
  const { data } = await api.get<ItemDetails>(`/items/${id}`, {
    signal: options?.signal,
  })

  return data
}

export const updateItemById = async (
  id: string,
  payload: UpdateItemIn,
  options?: RequestOptions,
): Promise<ItemDetails> => {
  const { data } = await api.put<ItemDetails>(`/items/${id}`, payload, {
    signal: options?.signal,
  })

  return data
}
