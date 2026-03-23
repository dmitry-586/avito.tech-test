import { formatDateTime, formatPrice } from '@/shared/lib'
import type { ItemDetails } from '../model'
import { getItemParamsRows } from '../model'

interface AdDetailsContentProps {
  item: ItemDetails
}

export function AdDetailsContent({ item }: AdDetailsContentProps) {
  const paramsRows = getItemParamsRows(item)
  const filledParams = paramsRows.filter((row) => row.isFilled)
  const missingParams = paramsRows.filter((row) => !row.isFilled)

  return (
    <section data-page='ad-details' className='py-5'>
      <div className='flex justify-between gap-6'>
        <h1 className='text-3xl font-medium'>{item.title}</h1>
        <p className='shrink-0 text-3xl font-medium'>
          {formatPrice(item.price)}
        </p>
      </div>

      <div className='mt-3 flex items-center justify-between'>
        <button className='bg-blue flex items-center gap-2 rounded-lg px-3 py-2 text-white'>
          <p>Редактировать</p>
          <img src='/Edit.svg' alt='edit' />
        </button>
        <div className='text-gray flex flex-col items-end'>
          <p>Опубликовано: {formatDateTime(item.createdAt)}</p>
          <p>Отредактировано: {formatDateTime(item.updatedAt)}</p>
        </div>
      </div>
      <hr className='my-8 border-gray-300' />
      <div className='grid gap-6 lg:grid-cols-[1fr_1.2fr]'>
        <div className='bg-neutral/30 h-full min-h-70 overflow-hidden rounded-lg'>
          <img
            className='block h-full w-full object-cover'
            src='/placeholder-img.png'
            alt='Обложка объявления'
          />
        </div>

        <div className='flex flex-col gap-6'>
          {missingParams.length > 0 ? (
            <section className='bg-light-yellow flex gap-4 rounded-xl px-4 py-3 shadow-lg'>
              <span className='bg-yellow inline-flex size-4.5 items-center justify-center rounded-full text-xs font-semibold text-white'>
                !
              </span>
              <div>
                <h2 className='leading-tight font-semibold'>
                  Требуются доработки
                </h2>
                <p className='mt-3 text-sm'>У объявления не заполнены поля:</p>
                <ul className='list-disc pl-5 text-sm'>
                  {missingParams.map((row) => (
                    <li key={row.label}>{row.label}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <div className='mt-3'>
            <h2 className='text-[22px] font-medium'>Характеристики</h2>

            {!filledParams.length ? (
              <p className='mt-4 text-black/50'>
                Нет заполненных характеристик
              </p>
            ) : (
              <div className='mt-4 grid w-fit grid-cols-2 gap-x-10 gap-y-2'>
                {filledParams.map(({ label, value }) => (
                  <div key={label} className='contents'>
                    <p className='font-semibold text-black/45'>{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className='text-[22px] font-medium'>Описание</h3>
          <p className='mt-4'>
            {!!item.description ? item.description : 'Отсутствует'}
          </p>
        </div>
      </div>
    </section>
  )
}
