import { PageErrorState, PageLoadingState } from '@/shared/ui'
import { useMediaQuery } from '@mantine/hooks'
import {
  DEFAULT_VIEW_VARIANT,
  ITEMS_PER_PAGE,
  type ItemCard,
  useListStore,
} from '../model'
import { Card } from './card'
import { SimplePagination } from './pagination'

interface ListProps {
  error: Error | null
  isLoading: boolean
  items: ItemCard[]
  total: number
}

export function List({ error, isLoading, items, total }: ListProps) {
  const { page, setPage, viewVariant } = useListStore()

  const isMobile = useMediaQuery('(max-width: 500px)')
  const effectiveViewVariant = isMobile ? DEFAULT_VIEW_VARIANT : viewVariant

  if (isLoading) {
    return <PageLoadingState />
  }

  if (error) {
    return (
      <PageErrorState
        title='Мои объявления'
        message='Ошибка при получении списка объявлений.'
      />
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  return (
    <section className='@container w-full'>
      {items.length > 0 ? (
        <div
          className={
            effectiveViewVariant === 'full-width'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-5 gap-3 @max-5xl:grid-cols-4 @max-4xl:grid-cols-3 @max-2xl:grid-cols-2 @max-sm:grid-cols-1'
          }
        >
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              category={item.category}
              title={item.title}
              price={item.price}
              needsRevision={item.needsRevision}
              variant={effectiveViewVariant}
            />
          ))}
        </div>
      ) : (
        <p className='rounded-2xl bg-white p-6 text-center text-sm text-black/50'>
          По вашему запросу ничего не найдено
        </p>
      )}

      <SimplePagination
        className='mt-4'
        currentPage={page}
        onPageChange={setPage}
        totalPages={totalPages}
      />
    </section>
  )
}
