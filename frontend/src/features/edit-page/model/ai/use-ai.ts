import { improveDescription, suggestPrice, type AiEndpointIn } from '@/services'
import { getDescriptionButtonLabel, getPriceButtonLabel } from './labels'
import { useAiRequest } from './use-ai-request'

interface UseAiOptions {
  getPayload: () => AiEndpointIn
  isDescriptionEmpty: boolean
  isRequestDisabled: boolean
  onApplyDescription: (description: string) => void
  onApplyPrice: (price: number) => void
}

function requestIfEnabled(isRequestDisabled: boolean, request: () => void) {
  return () => {
    if (isRequestDisabled) {
      return
    }

    request()
  }
}

export function useAi({
  getPayload,
  isDescriptionEmpty,
  isRequestDisabled,
  onApplyDescription,
  onApplyPrice,
}: UseAiOptions) {
  const priceState = useAiRequest({
    getPayload,
    mutationFn: suggestPrice,
  })
  const descriptionState = useAiRequest({
    getPayload,
    mutationFn: improveDescription,
  })

  const requestPriceSuggestion = requestIfEnabled(
    isRequestDisabled,
    priceState.request,
  )
  const requestDescriptionSuggestion = requestIfEnabled(
    isRequestDisabled,
    descriptionState.request,
  )

  const applySuggestedPrice = () => {
    const price =
      priceState.status === 'success' ? priceState.result?.price : null
    if (price == null) {
      return
    }

    onApplyPrice(price)
    priceState.closeTooltip()
  }

  const applyImprovedDescription = () => {
    const message =
      descriptionState.status === 'success'
        ? descriptionState.result?.message
        : null
    if (!message) {
      return
    }

    onApplyDescription(message)
    descriptionState.closeTooltip()
  }

  return {
    price: {
      buttonLabel: getPriceButtonLabel({
        hasCompleted: priceState.hasCompleted,
        isPending: priceState.isPending,
      }),
      closeTooltip: priceState.closeTooltip,
      isDisabled: isRequestDisabled,
      isPending: priceState.isPending,
      request: requestPriceSuggestion,
      responseText: priceState.result?.message ?? null,
      status: priceState.status,
      tooltipOpened: priceState.tooltipOpened,
      applySuggestion: applySuggestedPrice,
    },
    description: {
      buttonLabel: getDescriptionButtonLabel({
        hasCompleted: descriptionState.hasCompleted,
        isDescriptionEmpty,
        isPending: descriptionState.isPending,
      }),
      closeTooltip: descriptionState.closeTooltip,
      isDisabled: isRequestDisabled,
      isPending: descriptionState.isPending,
      request: requestDescriptionSuggestion,
      responseText: descriptionState.result?.message ?? null,
      status: descriptionState.status,
      tooltipOpened: descriptionState.tooltipOpened,
      applySuggestion: applyImprovedDescription,
    },
  }
}
