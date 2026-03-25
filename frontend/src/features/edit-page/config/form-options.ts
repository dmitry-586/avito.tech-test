import {
  AUTO_TRANSMISSION_OPTIONS,
  AUTO_TRANSMISSION_VALUES,
  ELECTRONICS_CONDITION_OPTIONS,
  ELECTRONICS_CONDITION_VALUES,
  ELECTRONICS_TYPE_OPTIONS,
  ELECTRONICS_TYPE_VALUES,
  ITEM_CATEGORY_OPTIONS,
  REAL_ESTATE_TYPE_OPTIONS,
  REAL_ESTATE_TYPE_VALUES,
} from '@/shared/constants'
import type { ItemCategory, SelectOption } from '@/shared/types'

const EMPTY_SELECT_VALUE = '' as const
const EMPTY_OPTION_LABEL = 'Не выбрано'

function withEmptyValue<TValues extends readonly string[]>(values: TValues) {
  return [EMPTY_SELECT_VALUE, ...values] as const
}

function withEmptyOption<TValue extends string>(
  options: ReadonlyArray<SelectOption<TValue>>,
) {
  return [
    { value: EMPTY_SELECT_VALUE, label: EMPTY_OPTION_LABEL },
    ...options,
  ] as const
}

export const ITEM_CATEGORY_VALUES = ITEM_CATEGORY_OPTIONS.map(
  ([value]) => value,
) as [ItemCategory, ...ItemCategory[]]

export const AUTO_TRANSMISSION_VALUES_WITH_EMPTY = withEmptyValue(
  AUTO_TRANSMISSION_VALUES,
)
export const REAL_ESTATE_TYPE_VALUES_WITH_EMPTY = withEmptyValue(
  REAL_ESTATE_TYPE_VALUES,
)
export const ELECTRONICS_TYPE_VALUES_WITH_EMPTY = withEmptyValue(
  ELECTRONICS_TYPE_VALUES,
)
export const ELECTRONICS_CONDITION_VALUES_WITH_EMPTY = withEmptyValue(
  ELECTRONICS_CONDITION_VALUES,
)

export const AUTO_TRANSMISSION_SELECT_OPTIONS = withEmptyOption(
  AUTO_TRANSMISSION_OPTIONS,
)
export const REAL_ESTATE_TYPE_SELECT_OPTIONS = withEmptyOption(
  REAL_ESTATE_TYPE_OPTIONS,
)
export const ELECTRONICS_TYPE_SELECT_OPTIONS = withEmptyOption(
  ELECTRONICS_TYPE_OPTIONS,
)
export const ELECTRONICS_CONDITION_SELECT_OPTIONS = withEmptyOption(
  ELECTRONICS_CONDITION_OPTIONS,
)
