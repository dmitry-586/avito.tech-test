import { useParams } from 'react-router-dom'
import { useItem } from './model'
import {
  AdDetailsContent,
  AdDetailsErrorState,
  AdDetailsLoadingState,
} from './ui'

export function AdDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { error, isLoading, item } = useItem(id)

  if (!id) {
    return <AdDetailsErrorState message='Некорректный ID объявления' />
  }

  if (isLoading) {
    return <AdDetailsLoadingState />
  }

  if (error || !item) {
    return (
      <AdDetailsErrorState message='Ошибка при получении детальной информации' />
    )
  }

  return <AdDetailsContent item={item} />
}
