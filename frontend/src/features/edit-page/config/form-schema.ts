import { ITEM_PARAMS_LABELS } from '@/shared/constants'
import { z } from 'zod'
import {
  AUTO_TRANSMISSION_VALUES_WITH_EMPTY,
  ELECTRONICS_CONDITION_VALUES_WITH_EMPTY,
  ELECTRONICS_TYPE_VALUES_WITH_EMPTY,
  ITEM_CATEGORY_VALUES,
  REAL_ESTATE_TYPE_VALUES_WITH_EMPTY,
} from './form-options'

const MAX_YEAR_OF_MANUFACTURE = new Date().getFullYear() + 1

export const EDIT_DESCRIPTION_MAX_LENGTH = 3_000

function isIntegerString(value: string) {
  return /^\d+$/.test(value)
}

function optionalIntegerField(
  label: string,
  options?: { max?: number; min?: number },
) {
  const min = options?.min ?? 0
  const max = options?.max
  const maxMessage = max == null ? '' : ` до ${max}`

  return z
    .string()
    .trim()
    .refine((value) => value === '' || isIntegerString(value), {
      message: `${label}: используйте целое число`,
    })
    .refine(
      (value) => {
        if (value === '') {
          return true
        }

        const numericValue = Number(value)
        if (max == null) {
          return numericValue >= min
        }

        return numericValue >= min && numericValue <= max
      },
      {
        message: `${label}: значение от ${min}${maxMessage}`,
      },
    )
}

const requiredIntegerField = z
  .string()
  .trim()
  .min(1, 'Цена должна быть заполнена')
  .refine((value) => isIntegerString(value), {
    message: 'Цена должна быть целым числом',
  })
  .refine((value) => Number(value) > 0, {
    message: 'Цена должна быть больше нуля',
  })

const optionalShortTextField = z
  .string()
  .trim()
  .max(80, 'Слишком длинное значение')

export const editFormSchema = z.object({
  category: z.enum(ITEM_CATEGORY_VALUES),
  title: z
    .string()
    .trim()
    .min(1, 'Название должно быть заполнено')
    .max(120, 'Название не должно быть длиннее 120 символов'),
  price: requiredIntegerField,
  description: z
    .string()
    .max(
      EDIT_DESCRIPTION_MAX_LENGTH,
      `Описание не должно быть длиннее ${EDIT_DESCRIPTION_MAX_LENGTH} символов`,
    ),

  autoBrand: optionalShortTextField,
  autoModel: optionalShortTextField,
  autoYearOfManufacture: optionalIntegerField(
    ITEM_PARAMS_LABELS.auto.yearOfManufacture,
    {
      min: 1886,
      max: MAX_YEAR_OF_MANUFACTURE,
    },
  ),
  autoTransmission: z.enum(AUTO_TRANSMISSION_VALUES_WITH_EMPTY),
  autoMileage: optionalIntegerField(ITEM_PARAMS_LABELS.auto.mileage),
  autoEnginePower: optionalIntegerField(ITEM_PARAMS_LABELS.auto.enginePower, {
    min: 1,
  }),

  realEstateType: z.enum(REAL_ESTATE_TYPE_VALUES_WITH_EMPTY),
  realEstateAddress: z
    .string()
    .trim()
    .max(
      160,
      `${ITEM_PARAMS_LABELS.real_estate.address} не должен быть длиннее 160 символов`,
    ),
  realEstateArea: optionalIntegerField(ITEM_PARAMS_LABELS.real_estate.area, {
    min: 1,
  }),
  realEstateFloor: optionalIntegerField(ITEM_PARAMS_LABELS.real_estate.floor),

  electronicsType: z.enum(ELECTRONICS_TYPE_VALUES_WITH_EMPTY),
  electronicsBrand: optionalShortTextField,
  electronicsModel: optionalShortTextField,
  electronicsCondition: z.enum(ELECTRONICS_CONDITION_VALUES_WITH_EMPTY),
  electronicsColor: z
    .string()
    .trim()
    .max(
      60,
      `${ITEM_PARAMS_LABELS.electronics.color} не должен быть длиннее 60 символов`,
    ),
})

export type EditFormValues = z.infer<typeof editFormSchema>

export const EDIT_FORM_DEFAULT_VALUES: EditFormValues = {
  category: 'auto',
  title: '',
  price: '',
  description: '',
  autoBrand: '',
  autoModel: '',
  autoYearOfManufacture: '',
  autoTransmission: '',
  autoMileage: '',
  autoEnginePower: '',
  realEstateType: '',
  realEstateAddress: '',
  realEstateArea: '',
  realEstateFloor: '',
  electronicsType: '',
  electronicsBrand: '',
  electronicsModel: '',
  electronicsCondition: '',
  electronicsColor: '',
}
