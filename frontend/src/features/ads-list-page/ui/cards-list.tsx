import { useMediaQuery } from '@mantine/hooks'
import { PageErrorState, PageLoadingState } from '@/shared/ui'
import {
  DEFAULT_VIEW_VARIANT,
  ITEMS_PER_PAGE,
  useCardsListItems,
  useCardsListStore,
} from '../model'
import { Card } from './card'
import { SimplePagination } from './pagination'

export function CardsList() {
  const { page, setPage, viewVariant } = useCardsListStore()
  const { error, isLoading, items, total } = useCardsListItems()

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

  const listClass =
    effectiveViewVariant === 'full-width'
      ? 'flex flex-col gap-4'
      : 'grid grid-cols-5 gap-3 @max-5xl:grid-cols-4 @max-4xl:grid-cols-3 @max-2xl:grid-cols-2 @max-sm:grid-cols-1'

  return (
    <section className='@container w-full'>
      {items.length > 0 ? (
        <div className={listClass}>
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
