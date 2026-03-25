import { formatDateTime, formatPrice } from '@/shared/lib'
import type { ItemDetails } from '@/shared/types'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  item: Pick<ItemDetails, 'createdAt' | 'id' | 'price' | 'title' | 'updatedAt'>
}

export function Header({ item }: HeaderProps) {
  return (
    <>
      <div className='flex flex-wrap justify-between gap-x-6 gap-y-3 text-2xl font-medium sm:text-3xl'>
        <div className='flex items-center gap-3'>
          <Link
            to='/'
            aria-label='На главную'
            className='bg-light-gray text-gray inline-flex items-center rounded-lg px-2 py-1'
          >
            <ArrowLeft className='size-5.5' aria-hidden='true' />
          </Link>
          <h1>{item.title}</h1>
        </div>
        <p className='shrink-0'>{formatPrice(item.price)}</p>
      </div>

      <div className='mt-3 flex justify-between gap-3 max-sm:flex-col sm:items-center'>
        <Link
          to={`/ads/${item.id}/edit`}
          className='bg-blue flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-white max-sm:order-1'
        >
          <p>Редактировать</p>
          <img src='/Edit.svg' alt='edit' />
        </Link>
        <div className='text-gray flex flex-col max-sm:order-0 max-sm:text-sm sm:items-end'>
          <p>Опубликовано: {formatDateTime(item.createdAt)}</p>
          <p>Отредактировано: {formatDateTime(item.updatedAt)}</p>
        </div>
      </div>
    </>
  )
}
