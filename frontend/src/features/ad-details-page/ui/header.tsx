import { formatDateTime, formatPrice } from '@/shared/lib'
import type { ItemDetails } from '../model'

interface AdDetailsHeaderProps {
  item: Pick<ItemDetails, 'createdAt' | 'price' | 'title' | 'updatedAt'>
}

export function AdDetailsHeader({ item }: AdDetailsHeaderProps) {
  return (
    <>
      <div className='flex flex-wrap justify-between gap-x-6 gap-y-3 text-2xl font-medium sm:text-3xl'>
        <h1>{item.title}</h1>
        <p className='shrink-0'>{formatPrice(item.price)}</p>
      </div>

      <div className='mt-3 flex justify-between gap-3 max-sm:flex-col sm:items-center'>
        <button className='bg-blue flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-white max-sm:order-1'>
          <p>Редактировать</p>
          <img src='/Edit.svg' alt='edit' />
        </button>
        <div className='text-gray flex flex-col max-sm:order-0 max-sm:text-sm sm:items-end'>
          <p>Опубликовано: {formatDateTime(item.createdAt)}</p>
          <p>Отредактировано: {formatDateTime(item.updatedAt)}</p>
        </div>
      </div>
    </>
  )
}
