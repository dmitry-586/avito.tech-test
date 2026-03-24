import { useItem } from '@/services'
import { PageErrorState, PageLoadingState } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { AdEditForm } from './ui/form/form'

export function AdEditPage() {
  const { id } = useParams<{ id: string }>()
  const { error, isLoading, item } = useItem(id)

  if (!id) {
    return (
      <PageErrorState
        title='Редактирование объявления'
        message='Некорректный ID объявления'
        backHref='/ads'
        backLabel='К списку объявлений'
      />
    )
  }

  if (isLoading) {
    return <PageLoadingState />
  }

  if (error || !item) {
    return (
      <PageErrorState
        title='Редактирование объявления'
        message='Ошибка при получении данных объявления для редактирования'
        backHref='/ads'
        backLabel='К списку объявлений'
      />
    )
  }

  return (
    <section data-page='ad-edit' className='py-5'>
      <h1 className='text-2xl font-medium sm:text-3xl'>
        Редактирование объявления
      </h1>

      <AdEditForm key={id} adId={id} item={item} />
    </section>
  )
}
