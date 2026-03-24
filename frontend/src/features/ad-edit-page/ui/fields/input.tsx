import { TextInput, type TextInputProps } from '@mantine/core'
import { X } from 'lucide-react'
import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardedRef,
} from 'react'
import {
  AD_EDIT_FIELD_INPUT_BASE_CLASS,
  getFieldBorderClass,
} from './field-visual-state'

type Props = Omit<TextInputProps, 'classNames'>

function normalizeValue(value: unknown) {
  if (value == null) {
    return ''
  }

  return String(value)
}

function setExternalRef(
  ref: ForwardedRef<HTMLInputElement>,
  node: HTMLInputElement | null,
) {
  if (typeof ref === 'function') {
    ref(node)
    return
  }

  if (ref) {
    ref.current = node
  }
}

export const AdEditTextInput = forwardRef<HTMLInputElement, Props>(
  function AdEditTextInput(
    {
      error,
      onBlur,
      onChange,
      onFocus,
      value,
      defaultValue,
      required,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null)

    const isControlled = value !== undefined
    const [isFocused, setIsFocused] = useState(false)
    const [localValue, setLocalValue] = useState(() =>
      normalizeValue(defaultValue),
    )

    const currentValue = isControlled ? normalizeValue(value) : localValue
    const isEmpty = currentValue.trim() === ''
    const hasError = Boolean(error) || (Boolean(required) && isEmpty)

    const borderClass = getFieldBorderClass({
      hasError,
      isFocused,
      isEmpty,
    })

    const syncLocalValue = (nextValue: string) => {
      if (!isControlled) {
        setLocalValue(nextValue)
      }
    }

    const clearValue = () => {
      const input = inputRef.current
      if (!input) {
        return
      }

      input.value = ''
      syncLocalValue('')
      onChange?.({
        target: input,
        currentTarget: input,
      } as ChangeEvent<HTMLInputElement>)
      input.focus()
    }

    return (
      <TextInput
        {...props}
        error={error}
        required={required}
        withAsterisk={Boolean(required)}
        defaultValue={defaultValue}
        value={value}
        onFocus={(event) => {
          setIsFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsFocused(false)
          syncLocalValue(event.currentTarget.value)
          onBlur?.(event)
        }}
        onChange={(event) => {
          syncLocalValue(event.currentTarget.value)
          onChange?.(event)
        }}
        ref={(node) => {
          inputRef.current = node
          setExternalRef(ref, node)

          if (!isControlled && node) {
            setLocalValue((prev) => (prev === node.value ? prev : node.value))
          }
        }}
        rightSection={
          currentValue.length > 0 ? (
            <button
              type='button'
              onClick={clearValue}
              className='flex size-4 items-center justify-center rounded-full bg-black/25 text-white'
              aria-label='Очистить поле'
            >
              <X className='size-3' aria-hidden='true' />
            </button>
          ) : null
        }
        rightSectionPointerEvents={currentValue.length > 0 ? 'all' : 'none'}
        classNames={{
          wrapper: 'max-w-114 mt-1',
          label: 'inline-flex flex-row-reverse items-center gap-1',
          required: 'text-red-500',
          input: `${AD_EDIT_FIELD_INPUT_BASE_CLASS} ${borderClass}`,
          section: 'h-8',
          error: 'mt-1.5',
        }}
      />
    )
  },
)
