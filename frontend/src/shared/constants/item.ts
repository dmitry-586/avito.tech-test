import type { ItemCategory } from '@/shared/types/item'

export const ITEM_CATEGORY_OPTIONS: ReadonlyArray<
  readonly [ItemCategory, string]
> = [
  ['auto', 'Авто'],
  ['electronics', 'Электроника'],
  ['real_estate', 'Недвижимость'],
]

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  auto: 'Авто',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}
