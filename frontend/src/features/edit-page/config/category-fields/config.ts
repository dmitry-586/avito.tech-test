import type { EditFormValues } from '../form-schema'
import { AUTO_CATEGORY_CONFIG } from './auto'
import { ELECTRONICS_CATEGORY_CONFIG } from './electronics'
import { REAL_ESTATE_CATEGORY_CONFIG } from './real-estate'
import type { CategoryConfig } from './types'

export const CATEGORY_FIELDS_CONFIG: Record<
  EditFormValues['category'],
  CategoryConfig
> = {
  auto: AUTO_CATEGORY_CONFIG,
  real_estate: REAL_ESTATE_CATEGORY_CONFIG,
  electronics: ELECTRONICS_CATEGORY_CONFIG,
}
