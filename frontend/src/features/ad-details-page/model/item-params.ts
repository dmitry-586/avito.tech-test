import type { ItemDetails } from '@/shared/types/item'

export interface ItemParamRow {
  isFilled: boolean
  label: string
  value: string
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

export function getItemParamsRows(item: ItemDetails): ItemParamRow[] {
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

  return rows.map((row) => {
    if (row.value == null || row.value === '') {
      return {
        isFilled: false,
        label: row.label,
        value: 'Не указано',
      }
    }

    return {
      isFilled: true,
      label: row.label,
      value:
        typeof row.value === 'number'
          ? row.value.toLocaleString('ru-RU')
          : row.value,
    }
  })
}