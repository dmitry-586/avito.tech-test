import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCategory,
  OptionTuple,
  RealEstateItemParams,
  SelectOption,
} from '@/shared/types'

type AutoTransmission = NonNullable<AutoItemParams['transmission']>
type RealEstateType = NonNullable<RealEstateItemParams['type']>
type ElectronicsType = NonNullable<ElectronicsItemParams['type']>
type ElectronicsCondition = NonNullable<ElectronicsItemParams['condition']>

function toSelectOptions<TValue extends string>(
  options: ReadonlyArray<OptionTuple<TValue>>,
): ReadonlyArray<SelectOption<TValue>> {
  return options.map(([value, label]) => ({ label, value }))
}

function toLabels<TValue extends string>(
  options: ReadonlyArray<OptionTuple<TValue>>,
): Record<TValue, string> {
  return Object.fromEntries(options) as Record<TValue, string>
}

export const ITEM_CATEGORY_OPTIONS: ReadonlyArray<OptionTuple<ItemCategory>> = [
  ['auto', 'Авто'],
  ['electronics', 'Электроника'],
  ['real_estate', 'Недвижимость'],
]

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = toLabels(
  ITEM_CATEGORY_OPTIONS,
)

export const ITEM_CATEGORY_SELECT_OPTIONS: ReadonlyArray<
  SelectOption<ItemCategory>
> = toSelectOptions(ITEM_CATEGORY_OPTIONS)

export const AUTO_TRANSMISSION_VALUES = ['automatic', 'manual'] as const
export const AUTO_TRANSMISSION_LABELS: Record<AutoTransmission, string> = {
  automatic: 'Автомат',
  manual: 'Механика',
}
export const AUTO_TRANSMISSION_OPTIONS: ReadonlyArray<
  SelectOption<AutoTransmission>
> = AUTO_TRANSMISSION_VALUES.map((value) => ({
  label: AUTO_TRANSMISSION_LABELS[value],
  value,
}))

export const REAL_ESTATE_TYPE_VALUES = ['flat', 'house', 'room'] as const
export const REAL_ESTATE_TYPE_LABELS: Record<RealEstateType, string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
}
export const REAL_ESTATE_TYPE_OPTIONS: ReadonlyArray<
  SelectOption<RealEstateType>
> = REAL_ESTATE_TYPE_VALUES.map((value) => ({
  label: REAL_ESTATE_TYPE_LABELS[value],
  value,
}))

export const ELECTRONICS_TYPE_VALUES = ['phone', 'laptop', 'misc'] as const
export const ELECTRONICS_TYPE_LABELS: Record<ElectronicsType, string> = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
}
export const ELECTRONICS_TYPE_OPTIONS: ReadonlyArray<
  SelectOption<ElectronicsType>
> = ELECTRONICS_TYPE_VALUES.map((value) => ({
  label: ELECTRONICS_TYPE_LABELS[value],
  value,
}))

export const ELECTRONICS_CONDITION_VALUES = ['new', 'used'] as const
export const ELECTRONICS_CONDITION_LABELS: Record<
  ElectronicsCondition,
  string
> = {
  new: 'Новый',
  used: 'Б/у',
}
export const ELECTRONICS_CONDITION_OPTIONS: ReadonlyArray<
  SelectOption<ElectronicsCondition>
> = ELECTRONICS_CONDITION_VALUES.map((value) => ({
  label: ELECTRONICS_CONDITION_LABELS[value],
  value,
}))
