import { Textarea, type TextareaProps } from '@mantine/core'
import { forwardRef } from 'react'

type Props = Omit<TextareaProps, 'classNames'>

export const AdEditTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function AdEditTextarea(props, ref) {
    return (
      <Textarea
        {...props}
        ref={ref}
        inputWrapperOrder={['label', 'input', 'description', 'error']}
        classNames={{
          wrapper: 'mt-1',
          input:
            'border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none',
          description: 'mt-1 text-right text-xs',
          error: '-mt-3',
        }}
      />
    )
  },
)
