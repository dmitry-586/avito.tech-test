export type ItemId = number | string

export type ItemCategory = 'auto' | 'electronics' | 'real_estate'

export type OptionTuple<TValue extends string> = readonly [TValue, string]

export type SelectOption<TValue extends string> = Readonly<{
  label: string
  value: TValue
}>

export interface AutoItemParams {
  brand?: string
  model?: string
  yearOfManufacture?: number
  transmission?: 'automatic' | 'manual'
  mileage?: number
  enginePower?: number
}

export interface RealEstateItemParams {
  type?: 'flat' | 'house' | 'room'
  address?: string
  area?: number
  floor?: number
}

export interface ElectronicsItemParams {
  type?: 'phone' | 'laptop' | 'misc'
  brand?: string
  model?: string
  condition?: 'new' | 'used'
  color?: string
}

export interface ItemCard {
  id: ItemId
  category: ItemCategory
  needsRevision: boolean
  price: number
  title: string
}

interface BaseItemDetails {
  id: ItemId
  title: string
  description?: string
  price: number | null
  createdAt: string
  updatedAt: string
  needsRevision: boolean
}

export type ItemDetails =
  | (BaseItemDetails & { category: 'auto'; params: AutoItemParams })
  | (BaseItemDetails & {
      category: 'real_estate'
      params: RealEstateItemParams
    })
  | (BaseItemDetails & {
      category: 'electronics'
      params: ElectronicsItemParams
    })

export type ItemSortColumn = 'title' | 'createdAt' | 'price'

export type SortDirection = 'asc' | 'desc'

export interface ItemListQueryBase {
  limit?: number
  needsRevision?: true
  q?: string
  sortColumn?: ItemSortColumn
  sortDirection?: SortDirection
  skip?: number
}
