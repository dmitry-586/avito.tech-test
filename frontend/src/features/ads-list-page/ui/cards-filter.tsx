import { cn } from '@/shared/lib'
import { Checkbox } from '@/shared/ui'
import { Collapse, Switch } from '@mantine/core'
import { CATEGORY_OPTIONS, useCardsFilterStore } from '../model'

export function CardsFilter() {
  const {
    categories,
    isCategoriesOpen,
    needsRevisionOnly,
    resetFilters,
    setCategoryChecked,
    setNeedsRevisionOnly,
    toggleCategories,
  } = useCardsFilterStore()

  return (
    <aside className='flex w-full flex-col gap-2.5 lg:max-w-3xs'>
      <section className='@container rounded-lg bg-white p-4'>
        <h3 className='font-medium'>Фильтры</h3>
        <div className='mt-2.5 flex flex-col justify-between gap-2.5 @md:flex-row @md:items-start'>
          <div className='w-full max-w-40 lg:max-w-3xs'>
            <button
              type='button'
              className='flex w-full items-center justify-between text-left outline-none'
              onClick={toggleCategories}
            >
              <span className='text-sm'>Категория</span>
              <img
                src='/Down.svg'
                alt='arrow'
                className={cn(
                  'size-3 transition-transform duration-200',
                  isCategoriesOpen ? '' : 'rotate-180',
                )}
              />
            </button>

            <Collapse in={isCategoriesOpen}>
              <ul className='my-2 flex list-none flex-col gap-2'>
                {CATEGORY_OPTIONS.map(([category, label]) => (
                  <li key={category} className='flex'>
                    <Checkbox
                      checked={categories.includes(category)}
                      label={label}
                      onChange={(isChecked) =>
                        setCategoryChecked(category, isChecked)
                      }
                    />
                  </li>
                ))}
              </ul>
            </Collapse>
          </div>

          <hr className='border-gray-300' />

          <div className='flex items-center gap-5 md:justify-between'>
            <p className='text-sm font-medium'>Только требующие доработок</p>
            <Switch
              checked={needsRevisionOnly}
              onChange={(event) =>
                setNeedsRevisionOnly(event.currentTarget.checked)
              }
            />
          </div>
        </div>
      </section>

      <button
        type='button'
        className='text-gray w-full rounded-lg bg-white py-3 text-sm'
        onClick={resetFilters}
      >
        Сбросить фильтры
      </button>
    </aside>
  )
}
