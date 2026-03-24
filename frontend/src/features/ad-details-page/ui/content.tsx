import { getItemParamsPresentation, type ItemDetails } from '../model'
import { AdDetailsHeader } from './header'
import { AdDetailsParameters } from './params'

interface AdDetailsContentProps {
  item: ItemDetails
}

export function AdDetailsContent({ item }: AdDetailsContentProps) {
  const { filledParams, missingParams } = getItemParamsPresentation(item)
  const description = item.description?.trim() || 'Отсутствует'

  return (
    <section data-page='ad-details' className='py-5'>
      <AdDetailsHeader item={item} />
      <hr className='my-6 border-gray-300 sm:my-8' />
      <div className='grid gap-6 md:grid-cols-[1fr_1fr] lg:grid-cols-[auto_1.2fr]'>
        <div className='bg-neutral/30 h-full min-h-70 overflow-hidden rounded-lg md:max-w-120'>
          <img
            className='block h-full w-full object-cover'
            src='/placeholder-img.png'
            alt='Обложка объявления'
          />
        </div>

        <AdDetailsParameters
          filledParams={filledParams}
          missingParams={missingParams}
        />

        <section>
          <h3 className='text-xl font-medium sm:text-[22px]'>Описание</h3>
          <p className='mt-4'>{description}</p>
        </section>
      </div>
    </section>
  )
}
