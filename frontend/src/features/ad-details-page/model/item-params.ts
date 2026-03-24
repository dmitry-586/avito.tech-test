import {
  AUTO_TRANSMISSION_LABELS,
  ELECTRONICS_CONDITION_LABELS,
  ELECTRONICS_TYPE_LABELS,
  ITEM_PARAMS_LABELS,
  REAL_ESTATE_TYPE_LABELS,
} from '@/shared/constants'
import type { ItemDetails } from '@/shared/types'

export interface ItemParamRow {
  label: string
  value: string
}

export interface ItemParamsPresentation {
  filledParams: ItemParamRow[]
  missingParams: string[]
}

type RowInput = {
  label: string
  value: number | string | undefined
}

function getItemParamsRows(item: ItemDetails): RowInput[] {
  switch (item.category) {
    case 'auto':
      return [
        { label: ITEM_PARAMS_LABELS.auto.brand, value: item.params.brand },
        { label: ITEM_PARAMS_LABELS.auto.model, value: item.params.model },
        {
          label: ITEM_PARAMS_LABELS.auto.yearOfManufacture,
          value: item.params.yearOfManufacture,
        },
        {
          label: ITEM_PARAMS_LABELS.auto.transmission,
          value: item.params.transmission
            ? AUTO_TRANSMISSION_LABELS[item.params.transmission]
            : undefined,
        },
        { label: ITEM_PARAMS_LABELS.auto.mileage, value: item.params.mileage },
        {
          label: ITEM_PARAMS_LABELS.auto.enginePower,
          value: item.params.enginePower,
        },
      ]

    case 'real_estate':
      return [
        {
          label: ITEM_PARAMS_LABELS.real_estate.type,
          value: item.params.type
            ? REAL_ESTATE_TYPE_LABELS[item.params.type]
            : undefined,
        },
        { label: ITEM_PARAMS_LABELS.real_estate.address, value: item.params.address },
        { label: ITEM_PARAMS_LABELS.real_estate.area, value: item.params.area },
        { label: ITEM_PARAMS_LABELS.real_estate.floor, value: item.params.floor },
      ]

    case 'electronics':
      return [
        {
          label: ITEM_PARAMS_LABELS.electronics.type,
          value: item.params.type
            ? ELECTRONICS_TYPE_LABELS[item.params.type]
            : undefined,
        },
        { label: ITEM_PARAMS_LABELS.electronics.brand, value: item.params.brand },
        { label: ITEM_PARAMS_LABELS.electronics.model, value: item.params.model },
        {
          label: ITEM_PARAMS_LABELS.electronics.condition,
          value: item.params.condition
            ? ELECTRONICS_CONDITION_LABELS[item.params.condition]
            : undefined,
        },
        { label: ITEM_PARAMS_LABELS.electronics.color, value: item.params.color },
      ]
  }
}

export function getItemParamsPresentation(
  item: ItemDetails,
): ItemParamsPresentation {
  const filledParams: ItemParamRow[] = []
  const missingParams: string[] = []

  for (const row of getItemParamsRows(item)) {
    if (row.value == null) {
      missingParams.push(row.label)
      continue
    }

    if (typeof row.value === 'string') {
      const value = row.value.trim()

      if (value === '') {
        missingParams.push(row.label)
        continue
      }

      filledParams.push({
        label: row.label,
        value,
      })

      continue
    }

    filledParams.push({
      label: row.label,
      value: row.value.toLocaleString('ru-RU'),
    })
  }

  return { filledParams, missingParams }
}

