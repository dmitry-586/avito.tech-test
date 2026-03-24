export type CategoryFieldName =
  | 'autoBrand'
  | 'autoModel'
  | 'autoYearOfManufacture'
  | 'autoTransmission'
  | 'autoMileage'
  | 'autoEnginePower'
  | 'realEstateType'
  | 'realEstateAddress'
  | 'realEstateArea'
  | 'realEstateFloor'
  | 'electronicsType'
  | 'electronicsBrand'
  | 'electronicsModel'
  | 'electronicsCondition'
  | 'electronicsColor'

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
  options: ReadonlyArray<{ label: string; value: string }>
}

export type CategoryFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig

export interface CategoryConfig {
  fields: CategoryFieldConfig[]
  title: string
}
