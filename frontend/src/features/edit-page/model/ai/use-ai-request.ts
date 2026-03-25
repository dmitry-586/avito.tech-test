import type { AiEndpointIn } from '@/services'
import { useAbortController } from '@/shared/lib'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

type ResultStatus = 'idle' | 'success' | 'error'

interface UseAiRequestOptions<TResult> {
  getPayload: () => AiEndpointIn
  mutationFn: (
    payload: AiEndpointIn,
    options?: { signal?: AbortSignal },
  ) => Promise<TResult>
}

interface AiRequestState<TResult> {
  closeTooltip: () => void
  hasCompleted: boolean
  isPending: boolean
  request: () => void
  result: TResult | null
  status: ResultStatus
  tooltipOpened: boolean
}

function getResultStatus({
  isError,
  isSuccess,
}: {
  isError: boolean
  isSuccess: boolean
}): ResultStatus {
  if (isSuccess) {
    return 'success'
  }

  if (isError) {
    return 'error'
  }

  return 'idle'
}

export function useAiRequest<TResult>({
  getPayload,
  mutationFn,
}: UseAiRequestOptions<TResult>): AiRequestState<TResult> {
  const [result, setResult] = useState<TResult | null>(null)
  const [tooltipOpened, setTooltipOpened] = useState(false)
  const { nextSignal } = useAbortController()

  const { isError, isPending, isSuccess, mutate } = useMutation({
    mutationFn: (payload: AiEndpointIn) => {
      return mutationFn(payload, { signal: nextSignal() })
    },
    onMutate: () => {
      setTooltipOpened(false)
    },
    onSuccess: (response) => {
      setResult(response)
      setTooltipOpened(true)
    },
    onError: (error: Error) => {
      if (error.name === 'AbortError') {
        return
      }

      setResult(null)
      setTooltipOpened(true)
    },
  })

  const request = () => {
    if (isPending) {
      return
    }

    mutate(getPayload())
  }

  return {
    closeTooltip: () => setTooltipOpened(false),
    hasCompleted: isSuccess || isError,
    isPending,
    request,
    result,
    status: getResultStatus({ isError, isSuccess }),
    tooltipOpened,
  }
}
