import {
  AiErrorTooltip,
  AiTooltipActions,
  AiTooltipWrapper,
} from './ai-control-shell'
import type { AiResponseControlProps } from './types'

export function AiResponseControl({
  applySuggestion,
  buttonLabel,
  closeTooltip,
  isDisabled,
  isPending,
  request,
  responseText,
  status,
  tooltipOpened,
}: AiResponseControlProps) {
  return (
    <AiTooltipWrapper
      buttonLabel={buttonLabel}
      isError={status === 'error'}
      isDisabled={isDisabled}
      isPending={isPending}
      request={request}
      tooltipOpened={tooltipOpened}
    >
      {status === 'success' && responseText ? (
        <div className='p-2'>
          <p className='text-sm font-medium'>Ответ AI:</p>
          <div className='mt-1 text-sm whitespace-pre-wrap'>{responseText}</div>
          <AiTooltipActions onApply={applySuggestion} onClose={closeTooltip} />
        </div>
      ) : (
        <AiErrorTooltip onClose={closeTooltip} />
      )}
    </AiTooltipWrapper>
  )
}
