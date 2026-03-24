import type { ItemParamRow } from '../model'

interface AdDetailsParametersProps {
  filledParams: ItemParamRow[]
  missingParams: string[]
}

export function AdDetailsParameters({
  filledParams,
  missingParams,
}: AdDetailsParametersProps) {
  return (
    <section>
      {missingParams.length > 0 ? (
        <div className='bg-light-yellow flex max-w-lg gap-4 rounded-xl px-4 py-3 shadow-lg'>
          <span className='bg-yellow inline-flex size-4.5 items-center justify-center rounded-full text-xs font-semibold text-white'>
            !
          </span>
          <div>
            <h2 className='leading-tight font-semibold'>Требуются доработки</h2>
            <p className='mt-3 text-sm'>У объявления не заполнены поля:</p>
            <ul className='list-disc pl-5 text-sm'>
              {missingParams.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className={missingParams.length > 0 ? 'mt-6' : undefined}>
        <h2 className='text-xl font-medium sm:text-[22px]'>Характеристики</h2>

        {filledParams.length === 0 ? (
          <p className='mt-4 text-black/50'>Нет заполненных характеристик</p>
        ) : (
          <div className='mt-4 grid w-full max-w-xs grid-cols-[1fr_auto] gap-x-5 gap-y-2 lg:gap-x-10'>
            {filledParams.map(({ label, value }) => (
              <div key={label} className='contents'>
                <p className='font-semibold text-black/45'>{label}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
