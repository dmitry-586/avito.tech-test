import type { ItemDetails } from '@/shared/types/item'

export interface ItemParamRow {
  label: string
  value: string
}

export interface ItemParamsPresentation {
  filledParams: ItemParamRow[]
  missingParams: string[]
}

const TRANSMISSION_LABELS: Record<'automatic' | 'manual', string> = {
  automatic: 'Автомат',
  manual: 'Механика',
}

const REAL_ESTATE_TYPE_LABELS: Record<'flat' | 'house' | 'room', string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
}

const ELECTRONICS_TYPE_LABELS: Record<'phone' | 'laptop' | 'misc', string> = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
}

const ELECTRONICS_CONDITION_LABELS: Record<'new' | 'used', string> = {
  new: 'Новый',
  used: 'Б/у',
}

type RowInput = {
  label: string
  value: number | string | undefined
}

function getItemParamsRows(item: ItemDetails): RowInput[] {
  const rows: RowInput[] = []

  switch (item.category) {
    case 'auto':
      rows.push(
        { label: 'Бренд', value: item.params.brand },
        { label: 'Модель', value: item.params.model },
        { label: 'Год выпуска', value: item.params.yearOfManufacture },
        {
          label: 'Коробка передач',
          value: item.params.transmission
            ? TRANSMISSION_LABELS[item.params.transmission]
            : undefined,
        },
        { label: 'Пробег', value: item.params.mileage },
        { label: 'Мощность двигателя', value: item.params.enginePower },
      )
      break

    case 'real_estate':
      rows.push(
        {
          label: 'Тип',
          value: item.params.type
            ? REAL_ESTATE_TYPE_LABELS[item.params.type]
            : undefined,
        },
        { label: 'Адрес', value: item.params.address },
        { label: 'Площадь', value: item.params.area },
        { label: 'Этаж', value: item.params.floor },
      )
      break

    case 'electronics':
      rows.push(
        {
          label: 'Тип',
          value: item.params.type
            ? ELECTRONICS_TYPE_LABELS[item.params.type]
            : undefined,
        },
        { label: 'Бренд', value: item.params.brand },
        { label: 'Модель', value: item.params.model },
        {
          label: 'Состояние',
          value: item.params.condition
            ? ELECTRONICS_CONDITION_LABELS[item.params.condition]
            : undefined,
        },
        { label: 'Цвет', value: item.params.color },
      )
      break
  }

  return rows
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
