import { ITEM_CATEGORY_SELECT_OPTIONS } from '@/shared/constants'
import { cn } from '@/shared/lib'
import type { ReactNode } from 'react'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  AD_EDIT_DESCRIPTION_MAX_LENGTH,
  type AdEditFormValues,
} from '../../schema'
import { AdEditTextInput } from '../fields/input'
import { AdEditSelect } from '../fields/select'
import { AdEditTextarea } from '../fields/textarea'

interface AdEditSectionProps {
  children: ReactNode
  className?: string
  title: string
}

export function AdEditSection({
  children,
  className,
  title,
}: AdEditSectionProps) {
  return (
    <section>
      <h2 className='text-xl font-medium'>{title}</h2>
      <div className={cn('mt-4 grid gap-4', className)}>{children}</div>
    </section>
  )
}

export function FormDivider() {
  return <hr className='border-neutral' />
}

interface MainInfoSectionProps {
  control: Control<AdEditFormValues>
  errors: FieldErrors<AdEditFormValues>
  register: UseFormRegister<AdEditFormValues>
}

export function AdEditMainInfoSection({
  control,
  errors,
  register,
}: MainInfoSectionProps) {
  return (
    <AdEditSection title='Основная информация'>
      <AdEditSelect
        control={control}
        name='category'
        label='Категория'
        data={ITEM_CATEGORY_SELECT_OPTIONS}
        error={errors.category?.message}
      />

      <FormDivider />

      <AdEditTextInput
        required
        label='Название'
        placeholder='Например: iPhone 15'
        error={errors.title?.message}
        {...register('title')}
      />

      <FormDivider />

      <AdEditTextInput
        required
        label='Цена'
        type='number'
        min={1}
        placeholder='Например: 150000'
        error={errors.price?.message}
        {...register('price')}
      />

      <FormDivider />
    </AdEditSection>
  )
}

interface DescriptionFieldProps {
  descriptionLength: number
  error?: string
  register: UseFormRegister<AdEditFormValues>
}

export function AdEditDescriptionField({
  descriptionLength,
  error,
  register,
}: DescriptionFieldProps) {
  return (
    <AdEditTextarea
      label='Описание'
      minRows={6}
      placeholder='Расскажите подробнее о товаре'
      error={error}
      description={`${descriptionLength}/${AD_EDIT_DESCRIPTION_MAX_LENGTH}`}
      {...register('description')}
    />
  )
}

interface FormActionsProps {
  adDetailsPath: string
  isPending: boolean
  isSubmitDisabled: boolean
}

export function AdEditFormActions({
  adDetailsPath,
  isPending,
  isSubmitDisabled,
}: FormActionsProps) {
  return (
    <div className='flex gap-2.5'>
      <button
        type='submit'
        disabled={isSubmitDisabled}
        className='bg-blue disabled:bg-light-gray disabled:white/25 rounded-lg px-3 py-2 text-white'
      >
        {isPending ? 'Сохраняем...' : 'Сохранить'}
      </button>
      <Link
        to={adDetailsPath}
        className='bg-light-gray rounded-lg px-3 py-2 text-black/65'
      >
        Отменить
      </Link>
    </div>
  )
}
