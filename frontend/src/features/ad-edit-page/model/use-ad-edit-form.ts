import type { ItemDetails } from '@/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UseFormReturn } from 'react-hook-form'
import { useForm, useWatch } from 'react-hook-form'
import { adEditFormSchema, type AdEditFormValues } from '../schema'
import { mapItemToAdEditFormValues } from './map-item-to-form'

export type EditForm = UseFormReturn<AdEditFormValues> & {
  descriptionLength: number
  selectedCategory: AdEditFormValues['category']
}

export function useAdEditForm(item: ItemDetails): EditForm {
  const defaultValues = mapItemToAdEditFormValues(item)

  const form = useForm<AdEditFormValues>({
    defaultValues,
    resolver: zodResolver(adEditFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

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

  return {
    ...form,
    descriptionLength: descriptionValue.length,
    selectedCategory,
  }
}
