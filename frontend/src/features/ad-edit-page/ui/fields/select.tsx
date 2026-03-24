import { Select, type SelectProps } from '@mantine/core'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { AdEditFormValues } from '../../schema'
import {
  AD_EDIT_FIELD_INPUT_BASE_CLASS,
  getFieldBorderClass,
} from './field-visual-state'

type Props = Omit<
  SelectProps,
  'classNames' | 'value' | 'onChange' | 'error'
> & {
  control: Control<AdEditFormValues>
  name: FieldPath<AdEditFormValues>
  error?: string
}

export function AdEditSelect({
  control,
  name,
  error,
  onDropdownOpen: onOpen,
  onDropdownClose: onClose,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === 'string' ? field.value : ''
        const isEmpty = value.trim() === ''
        const borderClass = getFieldBorderClass({
          hasError: Boolean(error),
          isFocused: isOpen,
          isEmpty,
        })

        return (
          <Select
            {...props}
            value={value === '' ? null : value}
            onChange={field.onChange}
            error={error}
            onDropdownOpen={() => {
              setIsOpen(true)
              onOpen?.()
            }}
            onDropdownClose={() => {
              setIsOpen(false)
              onClose?.()
            }}
            rightSection={
              <ChevronDown
                aria-hidden='true'
                className={`text-light-gray pointer-events-none size-4 transition-transform duration-150 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            }
            rightSectionPointerEvents='none'
            classNames={{
              wrapper: 'max-w-114 mt-1',
              input: `${AD_EDIT_FIELD_INPUT_BASE_CLASS} ${borderClass}`,
              dropdown:
                'border border-light-gray mt-1 rounded-sm p-1 shadow-md',
              options: 'bg-white px-1',
              option: 'mt-1 px-1 text-sm',
              error: 'mt-1.5',
            }}
          />
        )
      }}
    />
  )
}
