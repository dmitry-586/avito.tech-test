import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { AdEditFormValues } from '../../schema'
import { AdEditTextInput } from '../fields/input'
import { AdEditSelect } from '../fields/select'
import { AdEditSection } from '../form/sections'
import {
  CATEGORY_FIELDS_CONFIG,
  type CategoryFieldConfig,
  type CategoryFieldName,
} from './config'

interface CategoryFieldsSectionProps {
  category: AdEditFormValues['category']
  control: Control<AdEditFormValues>
  errors: FieldErrors<AdEditFormValues>
  register: UseFormRegister<AdEditFormValues>
}

export function CategoryFieldsSection({
  category,
  control,
  errors,
  register,
}: CategoryFieldsSectionProps) {
  const { fields, title } = CATEGORY_FIELDS_CONFIG[category]

  return (
    <AdEditSection title={title}>
      {fields.map((field) =>
        renderCategoryField({
          control,
          error: getFieldError(errors, field.name),
          field,
          register,
        }),
      )}
    </AdEditSection>
  )
}

function renderCategoryField({
  control,
  error,
  field,
  register,
}: {
  control: Control<AdEditFormValues>
  error?: string
  field: CategoryFieldConfig
  register: UseFormRegister<AdEditFormValues>
}) {
  if (field.kind === 'select') {
    return (
      <AdEditSelect
        key={field.name}
        control={control}
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        data={field.options}
        error={error}
      />
    )
  }

  return (
    <AdEditTextInput
      key={field.name}
      label={field.label}
      placeholder={field.placeholder}
      type={field.kind === 'number' ? 'number' : undefined}
      min={field.kind === 'number' ? field.min : undefined}
      error={error}
      {...register(field.name)}
    />
  )
}

function getFieldError(
  errors: FieldErrors<AdEditFormValues>,
  name: CategoryFieldName,
) {
  const message = errors[name]?.message
  return typeof message === 'string' ? message : undefined
}
