import { Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useItem } from './model'
import { AdDetailsContent } from './ui'

interface ErrorStateProps {
  message: string
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <section className='rounded-2xl bg-white p-6'>
      <h2 className='text-xl font-medium'>Карточка объявления</h2>
      <p className='mt-2 text-sm text-black/60'>{message}</p>
      <Link
        to='/ads'
        className='text-blue mt-4 inline-flex rounded-md border border-current px-3 py-1.5 text-sm'
      >
        К списку
      </Link>
    </section>
  )
}

export function AdDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { error, isLoading, item } = useItem(id)

  if (!id) {
    return <ErrorState message='Некорректный ID объявления' />
  }

  if (isLoading) {
    return (
      <section className='flex w-full items-center justify-center py-12'>
        <Loader2 className='text-blue size-8 animate-spin' />
      </section>
    )
  }

  if (error || !item) {
    return <ErrorState message='Ошибка при получении детальной информации' />
  }

  return <AdDetailsContent item={item} />
}
