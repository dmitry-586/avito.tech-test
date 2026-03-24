import { ITEM_PARAMS_LABELS } from '@/shared/constants'
import {
  ELECTRONICS_CONDITION_SELECT_OPTIONS,
  ELECTRONICS_TYPE_SELECT_OPTIONS,
} from '../../constants'
import type { CategoryConfig } from './types'

const electronics = ITEM_PARAMS_LABELS.electronics

export const ELECTRONICS_CATEGORY_CONFIG: CategoryConfig = {
  title: 'Характеристики электроники',
  fields: [
    {
      kind: 'select',
      name: 'electronicsType',
      label: electronics.type,
      placeholder: 'Выберите тип техники',
      options: ELECTRONICS_TYPE_SELECT_OPTIONS,
    },
    {
      kind: 'text',
      name: 'electronicsBrand',
      label: electronics.brand,
      placeholder: 'Например: Apple',
    },
    {
      kind: 'text',
      name: 'electronicsModel',
      label: electronics.model,
      placeholder: 'Например: MacBook Pro',
    },
    {
      kind: 'select',
      name: 'electronicsCondition',
      label: electronics.condition,
      placeholder: 'Выберите состояние',
      options: ELECTRONICS_CONDITION_SELECT_OPTIONS,
    },
    {
      kind: 'text',
      name: 'electronicsColor',
      label: electronics.color,
      placeholder: 'Например: Черный',
    },
  ],
}
