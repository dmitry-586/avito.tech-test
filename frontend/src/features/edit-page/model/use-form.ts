import type { ItemDetails } from '@/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm, useWatch } from 'react-hook-form'
import { editFormSchema, type EditFormValues } from '../config'
import { useEditDraftStore } from './draft-store'
import { mapItemToFormValues } from './mappers'

type EditForm = UseFormReturn<EditFormValues> & {
  descriptionLength: number
  descriptionValue: string
  selectedCategory: EditFormValues['category']
  titleValue: string
}

export function useEditForm(item: ItemDetails, itemId: string): EditForm {
  const initialValues = mapItemToFormValues(item)
  const draftValues = useEditDraftStore.getState().getDraft(itemId)
  const saveDraft = useEditDraftStore((state) => state.saveDraft)

  const defaultValues = draftValues
    ? { ...initialValues, ...draftValues }
    : initialValues

  const form = useForm<EditFormValues>({
    defaultValues,
    resolver: zodResolver(editFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (!draftValues) {
      return
    }

    void form.trigger()
  }, [draftValues, form])

  useEffect(() => {
    const subscription = form.watch((values, meta) => {
      if (!meta.name) {
        return
      }

      saveDraft(itemId, values as EditFormValues)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [form, itemId, saveDraft])

  const selectedCategory = useWatch({
    control: form.control,
    name: 'category',
    defaultValue: defaultValues.category,
  })

  const descriptionValue = useWatch({
    control: form.control,
    name: 'description',
    defaultValue: defaultValues.description,
  })

  const titleValue = useWatch({
    control: form.control,
    name: 'title',
    defaultValue: defaultValues.title,
  })

  return {
    ...form,
    descriptionLength: descriptionValue.length,
    descriptionValue,
    selectedCategory,
    titleValue,
  }
}
