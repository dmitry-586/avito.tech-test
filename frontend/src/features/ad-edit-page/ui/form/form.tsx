import type { ItemDetails } from '@/shared/types'
import { notifications } from '@mantine/notifications'
import { Check, CircleX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdEditForm } from '../../model/use-ad-edit-form'
import { useAdEditSubmit } from '../../model/use-ad-edit-submit'
import type { AdEditFormValues } from '../../schema'
import { CategoryFieldsSection } from '../category-fields/category-fields'
import {
  AdEditDescriptionField,
  AdEditFormActions,
  AdEditMainInfoSection,
  FormDivider,
} from './sections'

interface AdEditFormProps {
  adId: string
  item: ItemDetails
}

export function AdEditForm({ adId, item }: AdEditFormProps) {
  const form = useAdEditForm(item)
  const navigate = useNavigate()
  const { isPending, submit } = useAdEditSubmit(adId)
  const adDetailsPath = `/ads/${adId}`

  const onSubmit = async (values: AdEditFormValues) => {
    try {
      await submit(values)
      showAdEditSuccessNotification()
      navigate(adDetailsPath)
    } catch {
      showAdEditErrorNotification()
    }
  }

  const {
    control,
    descriptionLength,
    formState: { errors, isValid },
    handleSubmit,
    register,
    selectedCategory,
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-6 grid gap-4.5'>
      <AdEditMainInfoSection control={control} register={register} errors={errors} />

      <CategoryFieldsSection
        category={selectedCategory}
        control={control}
        register={register}
        errors={errors}
      />

      <FormDivider />

      <AdEditDescriptionField
        register={register}
        descriptionLength={descriptionLength}
        error={errors.description?.message}
      />

      <AdEditFormActions
        adDetailsPath={adDetailsPath}
        isPending={isPending}
        isSubmitDisabled={isPending || !isValid}
      />
    </form>
  )
}

function showAdEditSuccessNotification() {
  notifications.show({
    color: 'green',
    message: 'Изменения сохранены',
    icon: <Check className='size-3 text-white' />,
    classNames: {
      icon: 'size-4',
      root: 'border-green bg-light-green',
    },
    withCloseButton: false,
  })
}

function showAdEditErrorNotification() {
  notifications.show({
    color: 'red',
    title: 'Ошибка сохранения',
    message:
      'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
    icon: <CircleX className='text-red size-5' />,
    classNames: {
      icon: 'size-5 bg-transparent',
      root: 'border-pink bg-light-red items-start',
    },
    withCloseButton: false,
  })
}
