import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemDetails,
  RealEstateItemParams,
} from '@/shared/types'
import { EDIT_FORM_DEFAULT_VALUES, type EditFormValues } from '../../config'

type AutoFormFields = Pick<
  EditFormValues,
  Extract<keyof EditFormValues, `auto${string}`>
>

type RealEstateFormFields = Pick<
  EditFormValues,
  Extract<keyof EditFormValues, `realEstate${string}`>
>

type ElectronicsFormFields = Pick<
  EditFormValues,
  Extract<keyof EditFormValues, `electronics${string}`>
>

function mapAutoParamsToFormValues(params: AutoItemParams): AutoFormFields {
  return {
    autoBrand: params.brand ?? '',
    autoModel: params.model ?? '',
    autoYearOfManufacture: params.yearOfManufacture?.toString() ?? '',
    autoTransmission: params.transmission ?? '',
    autoMileage: params.mileage?.toString() ?? '',
    autoEnginePower: params.enginePower?.toString() ?? '',
  }
}

function mapRealEstateParamsToFormValues(
  params: RealEstateItemParams,
): RealEstateFormFields {
  return {
    realEstateType: params.type ?? '',
    realEstateAddress: params.address ?? '',
    realEstateArea: params.area?.toString() ?? '',
    realEstateFloor: params.floor?.toString() ?? '',
  }
}

function mapElectronicsParamsToFormValues(
  params: ElectronicsItemParams,
): ElectronicsFormFields {
  return {
    electronicsType: params.type ?? '',
    electronicsBrand: params.brand ?? '',
    electronicsModel: params.model ?? '',
    electronicsCondition: params.condition ?? '',
    electronicsColor: params.color ?? '',
  }
}

export function mapItemToFormValues(item: ItemDetails): EditFormValues {
  const baseValues: EditFormValues = {
    ...EDIT_FORM_DEFAULT_VALUES,
    category: item.category,
    title: item.title,
    price: item.price == null ? '' : item.price.toString(),
    description: item.description ?? '',
  }

  switch (item.category) {
    case 'auto':
      return {
        ...baseValues,
        ...mapAutoParamsToFormValues(item.params),
      }

    case 'real_estate':
      return {
        ...baseValues,
        ...mapRealEstateParamsToFormValues(item.params),
      }

    case 'electronics':
      return {
        ...baseValues,
        ...mapElectronicsParamsToFormValues(item.params),
      }
  }
}
