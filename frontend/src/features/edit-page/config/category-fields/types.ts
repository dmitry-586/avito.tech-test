import type { SelectOption } from '@/shared/types'
import type { EditFormValues } from '../form-schema'

type MainFormFieldName = 'category' | 'description' | 'price' | 'title'

export type CategoryFieldName = Exclude<keyof EditFormValues, MainFormFieldName>

interface BaseFieldConfig {
  label: string
  name: CategoryFieldName
  placeholder: string
}

interface TextFieldConfig extends BaseFieldConfig {
  kind: 'text'
}

interface NumberFieldConfig extends BaseFieldConfig {
  kind: 'number'
  min: number
}

interface SelectFieldConfig extends BaseFieldConfig {
  kind: 'select'
  options: ReadonlyArray<SelectOption<string>>
}

export type CategoryFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig

export interface CategoryConfig {
  fields: CategoryFieldConfig[]
}
