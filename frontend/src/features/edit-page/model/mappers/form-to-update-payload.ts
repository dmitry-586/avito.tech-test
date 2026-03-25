import type { UpdateItemIn } from '@/services'
import type {
  AutoItemParams,
  ElectronicsItemParams,
  RealEstateItemParams,
} from '@/shared/types'
import type { EditFormValues } from '../../config'

function toOptionalText(value: string) {
  const trimmedValue = value.trim()
  return trimmedValue === '' ? undefined : trimmedValue
}

function toOptionalInteger(value: string) {
  const trimmedValue = value.trim()
  return trimmedValue === '' ? undefined : Number(trimmedValue)
}

function toOptionalSelectValue<TValue extends string>(value: TValue | '') {
  return value === '' ? undefined : value
}

function compactObject<T extends Record<string, unknown>>(
  value: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, currentValue]) => currentValue !== undefined,
    ),
  ) as Partial<T>
}

function withDescription(
  payload: UpdateItemIn,
  description: string | undefined,
): UpdateItemIn {
  if (description == null) {
    return payload
  }

  return {
    ...payload,
    description,
  }
}

function mapAutoFormValuesToParams(values: EditFormValues): AutoItemParams {
  return compactObject({
    brand: toOptionalText(values.autoBrand),
    model: toOptionalText(values.autoModel),
    yearOfManufacture: toOptionalInteger(values.autoYearOfManufacture),
    transmission: toOptionalSelectValue(values.autoTransmission),
    mileage: toOptionalInteger(values.autoMileage),
    enginePower: toOptionalInteger(values.autoEnginePower),
  })
}

function mapRealEstateFormValuesToParams(
  values: EditFormValues,
): RealEstateItemParams {
  return compactObject({
    type: toOptionalSelectValue(values.realEstateType),
    address: toOptionalText(values.realEstateAddress),
    area: toOptionalInteger(values.realEstateArea),
    floor: toOptionalInteger(values.realEstateFloor),
  })
}

function mapElectronicsFormValuesToParams(
  values: EditFormValues,
): ElectronicsItemParams {
  return compactObject({
    type: toOptionalSelectValue(values.electronicsType),
    brand: toOptionalText(values.electronicsBrand),
    model: toOptionalText(values.electronicsModel),
    condition: toOptionalSelectValue(values.electronicsCondition),
    color: toOptionalText(values.electronicsColor),
  })
}

export function mapFormToUpdatePayload(values: EditFormValues): UpdateItemIn {
  const title = values.title.trim()
  const description = toOptionalText(values.description)
  const price = Number(values.price.trim())

  switch (values.category) {
    case 'auto':
      return withDescription(
        {
          category: 'auto',
          title,
          price,
          params: mapAutoFormValuesToParams(values),
        },
        description,
      )

    case 'real_estate':
      return withDescription(
        {
          category: 'real_estate',
          title,
          price,
          params: mapRealEstateFormValuesToParams(values),
        },
        description,
      )

    case 'electronics':
      return withDescription(
        {
          category: 'electronics',
          title,
          price,
          params: mapElectronicsFormValuesToParams(values),
        },
        description,
      )
  }
}
