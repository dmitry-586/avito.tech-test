export type AiControlStatus = 'idle' | 'success' | 'error'

export interface AiResponseState {
  applySuggestion: () => void
  buttonLabel: string
  closeTooltip: () => void
  isDisabled: boolean
  isPending: boolean
  request: () => void
  responseText: string | null
  status: AiControlStatus
  tooltipOpened: boolean
}

export type BaseAiControlProps = Pick<
  AiResponseState,
  | 'buttonLabel'
  | 'isDisabled'
  | 'isPending'
  | 'request'
  | 'tooltipOpened'
  | 'closeTooltip'
>

export type AiResponseControlProps = AiResponseState
