import { ITEM_PARAMS_LABELS } from '@/shared/constants'
import { REAL_ESTATE_TYPE_SELECT_OPTIONS } from '../form-options'
import type { CategoryConfig } from './types'

const realEstate = ITEM_PARAMS_LABELS.real_estate

export const REAL_ESTATE_CATEGORY_CONFIG: CategoryConfig = {
  fields: [
    {
      kind: 'select',
      name: 'realEstateType',
      label: realEstate.type,
      placeholder: 'Выберите тип недвижимости',
      options: REAL_ESTATE_TYPE_SELECT_OPTIONS,
    },
    {
      kind: 'text',
      name: 'realEstateAddress',
      label: realEstate.address,
      placeholder: 'Город, улица, дом',
    },
    {
      kind: 'number',
      name: 'realEstateArea',
      label: `${realEstate.area}, м2`,
      min: 1,
      placeholder: 'Например: 45',
    },
    {
      kind: 'number',
      name: 'realEstateFloor',
      label: realEstate.floor,
      min: 0,
      placeholder: 'Например: 7',
    },
  ],
}
