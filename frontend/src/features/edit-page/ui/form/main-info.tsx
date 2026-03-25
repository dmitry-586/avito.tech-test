import { ITEM_CATEGORY_SELECT_OPTIONS } from '@/shared/constants'
import type { ReactNode } from 'react'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { EDIT_DESCRIPTION_MAX_LENGTH, type EditFormValues } from '../../config'
import { EditSelect, EditTextarea, EditTextInput } from '../fields'
import { AiResponseControl } from './ai-response-control'
import type { AiResponseState } from './types'

export function FormDivider() {
  return <hr className='border-neutral' />
}

interface MainInfoSectionProps {
  control: Control<EditFormValues>
  errors: FieldErrors<EditFormValues>
  priceAi?: AiResponseState
  register: UseFormRegister<EditFormValues>
}

export function EditMainInfoSection({
  control,
  errors,
  priceAi,
  register,
}: MainInfoSectionProps) {
  return (
    <div className='flex flex-col gap-4 mt-4'>
      <EditSelect
        control={control}
        name='category'
        label='Категория'
        data={ITEM_CATEGORY_SELECT_OPTIONS}
        error={errors.category?.message}
      />

      <FormDivider />

      <EditTextInput
        required
        label='Название'
        placeholder='Например: iPhone 15'
        error={errors.title?.message}
        {...register('title')}
      />

      <FormDivider />

      <div>
        <label
          htmlFor='price-input'
          className='inline-flex items-center gap-1 text-sm font-medium'
        >
          <span className='text-red-500'>*</span>
          <span>Цена</span>
        </label>

        <div className='mt-1 flex gap-x-6 gap-y-2 max-md:flex-col'>
          <EditTextInput
            id='price-input'
            className='w-full max-w-114'
            wrapperClassName='mt-0'
            required
            type='number'
            min={1}
            placeholder='Например: 150000'
            error={errors.price?.message}
            {...register('price')}
          />

          {priceAi ? <AiResponseControl {...priceAi} /> : null}
        </div>
      </div>

      <FormDivider />
    </div>
  )
}

interface DescriptionFieldProps {
  aiControl?: ReactNode
  descriptionLength: number
  error?: string
  register: UseFormRegister<EditFormValues>
}

export function EditDescriptionField({
  aiControl,
  descriptionLength,
  error,
  register,
}: DescriptionFieldProps) {
  return (
    <div className='relative'>
      <EditTextarea
        label='Описание'
        minRows={6}
        placeholder='Расскажите подробнее о товаре'
        error={error}
        {...register('description')}
      />
      <div className='mt-2 flex justify-between'>
        {aiControl}
        <span className='pointer-events-none -mt-1 text-xs leading-none text-black/45'>
          {`${descriptionLength}/${EDIT_DESCRIPTION_MAX_LENGTH}`}
        </span>
      </div>
    </div>
  )
}

interface FormActionsProps {
  itemDetailsPath: string
  isPending: boolean
  isSubmitDisabled: boolean
}

export function EditFormActions({
  itemDetailsPath,
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
        to={itemDetailsPath}
        className='bg-light-gray rounded-lg px-3 py-2 text-black/65'
      >
        Отменить
      </Link>
    </div>
  )
}
