const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const

export function formatPrice(price: number | null) {
  if (price == null) {
    return 'Цена не указана'
  }

  return `${price.toLocaleString('ru-RU')} ₽`
}

export function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const day = date.getDate()
  const month = MONTHS_GENITIVE[date.getMonth()]
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${month} ${hours}:${minutes}`
}
