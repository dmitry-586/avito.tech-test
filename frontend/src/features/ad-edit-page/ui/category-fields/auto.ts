import { ITEM_PARAMS_LABELS } from '@/shared/constants'
import { AUTO_TRANSMISSION_SELECT_OPTIONS } from '../../constants'
import type { CategoryConfig } from './types'

const auto = ITEM_PARAMS_LABELS.auto

export const AUTO_CATEGORY_CONFIG: CategoryConfig = {
  title: 'Характеристики автомобиля',
  fields: [
    {
      kind: 'text',
      name: 'autoBrand',
      label: auto.brand,
      placeholder: 'Например: BMW',
    },
    {
      kind: 'text',
      name: 'autoModel',
      label: auto.model,
      placeholder: 'Например: X5',
    },
    {
      kind: 'number',
      name: 'autoYearOfManufacture',
      label: auto.yearOfManufacture,
      min: 1886,
      placeholder: 'Например: 2020',
    },
    {
      kind: 'select',
      name: 'autoTransmission',
      label: auto.transmission,
      placeholder: 'Выберите коробку передач',
      options: AUTO_TRANSMISSION_SELECT_OPTIONS,
    },
    {
      kind: 'number',
      name: 'autoMileage',
      label: `${auto.mileage}, км`,
      min: 0,
      placeholder: 'Например: 120000',
    },
    {
      kind: 'number',
      name: 'autoEnginePower',
      label: `${auto.enginePower}, л.с.`,
      min: 1,
      placeholder: 'Например: 249',
    },
  ],
}
