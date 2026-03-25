import { useItem } from '@/services'
import { ItemPageState } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { EditForm } from './ui/form/edit-form'

export function EditPage() {
  const { id } = useParams<{ id: string }>()
  const { error, isLoading, item } = useItem(id)

  return (
    <ItemPageState
      state={{ id, item, error, isLoading }}
      texts={{
        title: 'Редактирование объявления',
        invalidId: 'Некорректный ID объявления',
        loadError: 'Ошибка при получении данных объявления для редактирования',
        backLabel: 'К списку объявлений',
      }}
    >
      {({ id: itemId, item: currentItem }) => (
        <section data-page='edit' className='py-5'>
          <h1 className='text-xl font-medium sm:text-2xl md:text-3xl'>
            Редактирование объявления
          </h1>

          <EditForm key={itemId} itemId={itemId} item={currentItem} />
        </section>
      )}
    </ItemPageState>
  )
}
