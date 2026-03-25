import type { ItemDetails } from '@/shared/types'
import type { UseFormSetValue } from 'react-hook-form'
import type { EditFormValues } from '../config'
import { useAi } from './ai/use-ai'
import { mapFormToAiPayload } from './mappers'
import { useEditForm } from './use-form'
import { useEditSubmit } from './use-submit'

interface UseEditFormControllerParams {
  item: ItemDetails
  itemId: string
}

const FORM_UPDATE_OPTIONS = {
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true,
} as const

function applyFieldValue(
  setValue: UseFormSetValue<EditFormValues>,
  fieldName: 'description' | 'price',
  value: string,
) {
  setValue(fieldName, value, FORM_UPDATE_OPTIONS)
}

export function useEditFormController({
  item,
  itemId,
}: UseEditFormControllerParams) {
  const form = useEditForm(item, itemId)
  const { getValues, descriptionValue, setValue, titleValue } = form
  const { isPending, submit } = useEditSubmit(itemId)
  const itemDetailsPath = `/ads/${itemId}`
  const isAiRequestDisabled = titleValue.trim() === ''

  const ai = useAi({
    getPayload: () => mapFormToAiPayload(getValues()),
    isDescriptionEmpty: descriptionValue.trim() === '',
    isRequestDisabled: isAiRequestDisabled,
    onApplyDescription: (description: string) => {
      applyFieldValue(setValue, 'description', description)
    },
    onApplyPrice: (price: number) => {
      applyFieldValue(setValue, 'price', String(price))
    },
  })

  return {
    ai,
    form,
    isPending,
    itemDetailsPath,
    submit,
  }
}
