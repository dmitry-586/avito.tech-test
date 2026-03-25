import { useItem } from '@/services'
import { ItemPageState } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { Content } from './ui'

export function DetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { error, isLoading, item } = useItem(id)

  return (
    <ItemPageState
      state={{ id, item, error, isLoading }}
      texts={{
        title: 'Карточка объявления',
        invalidId: 'Некорректный ID объявления',
        loadError: 'Ошибка при получении детальной информации',
        backLabel: 'К списку',
      }}
    >
      {({ item: currentItem }) => <Content item={currentItem} />}
    </ItemPageState>
  )
}

