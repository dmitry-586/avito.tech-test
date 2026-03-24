interface FieldVisualState {
  hasError: boolean
  isEmpty: boolean
  isFocused: boolean
}

const BORDER_CLASS_BY_STATE = {
  default: 'border-light-gray',
  empty: 'border-yellow',
  error: 'border-red-500',
  focused: 'border-blue',
} as const

export const AD_EDIT_FIELD_INPUT_BASE_CLASS =
  'border h-8 min-h-8 rounded-lg px-3 text-sm focus:outline-none'

export function getFieldBorderClass({
  hasError,
  isEmpty,
  isFocused,
}: FieldVisualState) {
  if (hasError) {
    return BORDER_CLASS_BY_STATE.error
  }

  if (isFocused) {
    return BORDER_CLASS_BY_STATE.focused
  }

  if (isEmpty) {
    return BORDER_CLASS_BY_STATE.empty
  }

  return BORDER_CLASS_BY_STATE.default
}
