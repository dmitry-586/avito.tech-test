import type { ItemDetails } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import type { EditFormValues } from '../../config'
import { useEditFormController } from '../../model'
import { CategoryFieldsSection } from '../category-fields'
import { AiResponseControl } from './ai-response-control'
import {
  EditDescriptionField,
  EditFormActions,
  EditMainInfoSection,
  FormDivider,
} from './main-info'
import {
  showEditErrorNotification,
  showEditSuccessNotification,
} from './notifications'

interface EditFormProps {
  item: ItemDetails
  itemId: string
}

export function EditForm({ item, itemId }: EditFormProps) {
  const { ai, form, isPending, itemDetailsPath, submit } =
    useEditFormController({
      item,
      itemId,
    })
  const navigate = useNavigate()

  const onSubmit = async (values: EditFormValues) => {
    try {
      await submit(values)
      showEditSuccessNotification()
      navigate(itemDetailsPath)
    } catch {
      showEditErrorNotification()
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
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4.5'>
      <EditMainInfoSection
        control={control}
        register={register}
        errors={errors}
        priceAi={ai.price}
      />

      <CategoryFieldsSection
        category={selectedCategory}
        control={control}
        register={register}
        errors={errors}
      />

      <FormDivider />

      <EditDescriptionField
        register={register}
        descriptionLength={descriptionLength}
        error={errors.description?.message}
        aiControl={<AiResponseControl {...ai.description} />}
      />

      <EditFormActions
        itemDetailsPath={itemDetailsPath}
        isPending={isPending}
        isSubmitDisabled={isPending || !isValid}
      />
    </form>
  )
}
