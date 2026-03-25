import { Popover } from '@mantine/core'
import { cn } from '@/shared/lib'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ReactNode } from 'react'
import type { BaseAiControlProps } from './types'

const AiControlButton = forwardRef<
  HTMLButtonElement,
  Pick<
    BaseAiControlProps,
    'buttonLabel' | 'isDisabled' | 'isPending' | 'request'
  >
>(function AiControlButton(
  { buttonLabel, isDisabled, isPending, request },
  ref,
) {
  return (
    <button
      ref={ref}
      type='button'
      disabled={isPending || isDisabled}
      onClick={request}
      className='bg-light-yellow text-yellow h-8 min-h-8 w-fit rounded-lg px-3 text-sm font-medium disabled:opacity-70'
    >
      <span className='flex items-center gap-2'>
        {isPending ? (
          <Loader2
            aria-hidden='true'
            className='size-4 shrink-0 animate-spin'
          />
        ) : (
          <img
            src='/Bulb.svg'
            alt=''
            aria-hidden='true'
            className='size-4 shrink-0'
          />
        )}
        <span className='truncate'>{buttonLabel}</span>
      </span>
    </button>
  )
})

interface AiTooltipWrapperProps extends Pick<
  BaseAiControlProps,
  'buttonLabel' | 'isDisabled' | 'isPending' | 'request' | 'tooltipOpened'
> {
  children: ReactNode
  isError?: boolean
}

export function AiTooltipWrapper({
  buttonLabel,
  children,
  isError = false,
  isDisabled,
  isPending,
  request,
  tooltipOpened,
}: AiTooltipWrapperProps) {
  return (
    <Popover
      width={360}
      withArrow
      opened={tooltipOpened}
      position='top-start'
      middlewares={{ flip: false, shift: false }}
      hideDetached={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      withinPortal
    >
      <Popover.Target>
        <AiControlButton
          buttonLabel={buttonLabel}
          isDisabled={isDisabled}
          isPending={isPending}
          request={request}
        />
      </Popover.Target>
      <Popover.Dropdown
        className={cn(
          'rounded-xs shadow-md',
          isError ? 'bg-ai-error-bg' : 'bg-white',
        )}
      >
        {children}
      </Popover.Dropdown>
    </Popover>
  )
}

export function AiErrorTooltip({ onClose }: { onClose: () => void }) {
  return (
    <div className='flex flex-col gap-2 p-2'>
      <p className='text-ai-error-text font-medium'>
        Произошла ошибка при запросе к AI
      </p>
      <p className='text-sm'>
        Попробуйте повторить запрос или закройте уведомление
      </p>

      <button
        type='button'
        onClick={onClose}
        className='bg-ai-error-btn w-fit rounded px-2 py-0.5 text-sm text-black/85'
      >
        Закрыть
      </button>
    </div>
  )
}

interface AiTooltipActionsProps {
  onApply: () => void
  onClose: () => void
}

export function AiTooltipActions({ onApply, onClose }: AiTooltipActionsProps) {
  return (
    <div className='mt-2 flex gap-2.5'>
      <button
        type='button'
        onClick={onApply}
        className='bg-blue rounded px-2 py-0.5 text-sm text-white'
      >
        Применить
      </button>
      <button
        type='button'
        onClick={onClose}
        className='border-light-gray rounded border px-2 py-0.5 text-sm'
      >
        Закрыть
      </button>
    </div>
  )
}
