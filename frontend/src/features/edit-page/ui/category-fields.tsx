import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { CATEGORY_FIELDS_CONFIG, type EditFormValues } from '../config'
import type {
  CategoryFieldConfig,
  CategoryFieldName,
} from '../config/category-fields/types'
import { EditSelect, EditTextInput } from './fields'

interface CategoryFieldsSectionProps {
  category: EditFormValues['category']
  control: Control<EditFormValues>
  errors: FieldErrors<EditFormValues>
  register: UseFormRegister<EditFormValues>
}

export function CategoryFieldsSection({
  category,
  control,
  errors,
  register,
}: CategoryFieldsSectionProps) {
  const { fields } = CATEGORY_FIELDS_CONFIG[category]

  return (
    <div>
      <h2 className='font-medium'>Характеристики</h2>
      <div className='mt-2 flex flex-col gap-3'>
        {fields.map((field) =>
          renderCategoryField({
            control,
            error: getFieldError(errors, field.name),
            field,
            register,
          }),
        )}
      </div>
    </div>
  )
}

function renderCategoryField({
  control,
  error,
  field,
  register,
}: {
  control: Control<EditFormValues>
  error?: string
  field: CategoryFieldConfig
  register: UseFormRegister<EditFormValues>
}) {
  if (field.kind === 'select') {
    return (
      <EditSelect
        key={field.name}
        control={control}
        name={field.name}
        label={field.label}
        labelClassName='font-normal'
        placeholder={field.placeholder}
        data={field.options}
        error={error}
      />
    )
  }

  return (
    <EditTextInput
      key={field.name}
      label={field.label}
      labelClassName='font-normal'
      placeholder={field.placeholder}
      type={field.kind === 'number' ? 'number' : undefined}
      min={field.kind === 'number' ? field.min : undefined}
      error={error}
      {...register(field.name)}
    />
  )
}

function getFieldError(
  errors: FieldErrors<EditFormValues>,
  name: CategoryFieldName,
) {
  const message = errors[name]?.message
  return typeof message === 'string' ? message : undefined
}
