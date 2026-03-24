import { Field, Checkbox as HeadlessCheckbox, Label } from '@headlessui/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib'

type CheckboxProps = {
  label?: ReactNode
  className?: string
  boxClassName?: string
} & Pick<
  ComponentProps<typeof HeadlessCheckbox>,
  'checked' | 'onChange' | 'disabled'
>

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className,
  boxClassName,
}: CheckboxProps) {
  return (
    <Field
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      disabled={disabled}
    >
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className={cn(
          'group border-light-gray relative flex size-4 shrink-0 items-center justify-center rounded border bg-white transition-colors outline-none',
          'data-checked:border-blue data-checked:bg-blue',
          'hover:border-gray',
          'data-checked:hover:bg-blue/90',
          boxClassName,
        )}
      >
        <img
          src='/check.svg'
          alt=''
          className='pointer-events-none absolute mt-0.5 opacity-0 transition-opacity group-data-checked:opacity-100'
        />
      </HeadlessCheckbox>

      {label != null && (
        <Label className='cursor-pointer text-sm'>{label}</Label>
      )}
    </Field>
  )
}
