import { cn } from '@/shared/lib'
import { Select, TextInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { LayoutGrid, List, type LucideIcon } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { SORT_OPTIONS, useHeaderStore, type SortValue } from '../model'

type ViewToggleButtonProps = {
  icon: LucideIcon
  isActive: boolean
  onClick: () => void
}

function ViewToggleButton({
  icon: Icon,
  isActive,
  onClick,
}: ViewToggleButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex size-6 cursor-pointer items-center justify-center rounded-sm transition-colors'
    >
      <Icon className={cn('size-4', isActive ? 'text-blue' : 'text-black')} />
    </button>
  )
}

interface HeaderProps {
  total: number
}

export function Header({ total }: HeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    setSortValue,
    setViewVariant,
    sortValue,
    viewVariant,
  } = useHeaderStore()
  const isMobile = useMediaQuery('(max-width: 500px)')

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value)
  }

  const handleSortChange = (nextValue: string | null) => {
    if (!nextValue) return
    setSortValue(nextValue as SortValue)
  }

  return (
    <header>
      <div className='py-3'>
        <h2 className='text-[22px] leading-tight font-medium'>
          Мои объявления
        </h2>
        <p className='text-gray text-lg'>{total} объявлений</p>
      </div>
      <div className='mt-4 flex w-full gap-6 rounded-lg bg-white p-3 max-md:flex-col md:items-center'>
        <TextInput
          className='min-w-0 flex-1'
          classNames={{
            input:
              'bg-background h-8 min-h-8 rounded-lg px-3 text-sm focus:outline-none',
            section: 'h-8',
          }}
          onChange={handleSearchChange}
          placeholder='Найти объявление...'
          rightSection={<img aria-hidden='true' src='/search.svg' alt='' />}
          value={searchQuery}
        />
        <div className='flex items-center justify-between'>
          {!isMobile && (
            <div className='bg-background flex h-8 items-center rounded-lg px-2 py-0.5'>
              <ViewToggleButton
                icon={LayoutGrid}
                isActive={viewVariant === 'default'}
                onClick={() => setViewVariant('default')}
              />
              <span className='mx-2.5 h-full w-0.5 bg-white' />
              <ViewToggleButton
                icon={List}
                isActive={viewVariant === 'full-width'}
                onClick={() => setViewVariant('full-width')}
              />
            </div>
          )}
          <div
            className={cn(
              'bg-background flex h-8 w-fit items-center rounded-lg px-1',
              !isMobile ? 'ml-4' : '',
            )}
          >
            <Select
              data={SORT_OPTIONS}
              onChange={handleSortChange}
              value={sortValue}
              classNames={{
                wrapper: 'bg-white rounded-sm',
                input:
                  'h-5.5 min-h-5.5 min-w-60 px-3 text-sm focus:outline-none',
                dropdown: 'bg-background mt-1 rounded-sm p-1 shadow-lg',
                options: 'bg-white p-1',
                option: 'mt-1 text-sm',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
