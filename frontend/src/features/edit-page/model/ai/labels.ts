interface ButtonLabelParams {
  hasCompleted: boolean
  isPending: boolean
}

interface DescriptionButtonLabelParams extends ButtonLabelParams {
  isDescriptionEmpty: boolean
}

const PENDING_LABEL = 'Выполняется запрос'
const REPEAT_LABEL = 'Повторить запрос'

export function getPriceButtonLabel({
  hasCompleted,
  isPending,
}: ButtonLabelParams) {
  if (isPending) {
    return PENDING_LABEL
  }

  if (hasCompleted) {
    return REPEAT_LABEL
  }

  return 'Узнать рыночную цену'
}

export function getDescriptionButtonLabel({
  hasCompleted,
  isDescriptionEmpty,
  isPending,
}: DescriptionButtonLabelParams) {
  if (isPending) {
    return PENDING_LABEL
  }

  if (hasCompleted) {
    return REPEAT_LABEL
  }

  return isDescriptionEmpty ? 'Придумать описание' : 'Улучшить описание'
}
