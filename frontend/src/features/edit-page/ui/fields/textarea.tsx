import { Textarea, type TextareaProps } from '@mantine/core'
import { cn } from '@/shared/lib'
import { forwardRef } from 'react'

type Props = Omit<TextareaProps, 'classNames'> & {
  labelClassName?: string
}

export const EditTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function EditTextarea({ labelClassName, ...props }, ref) {
    return (
      <Textarea
        {...props}
        ref={ref}
        inputWrapperOrder={['label', 'input', 'error']}
        classNames={{
          wrapper: 'mt-1',
          label: cn('font-medium', labelClassName),
          input:
            'border border-light-gray rounded-lg px-3 pt-2 pb-6 text-sm focus:outline-none',
          error: 'mt-1.5',
        }}
      />
    )
  },
)
