import { cn, formatPrice } from '@/shared/lib'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS } from '../model'
import type { CardsViewVariant, ItemCard } from '../model'

interface CardProps extends Pick<
  ItemCard,
  'category' | 'id' | 'needsRevision' | 'price' | 'title'
> {
  variant?: CardsViewVariant
}

type CardVariantStyles = {
  category: string
  content: string
  image: string
  imageWrapper: string
  root: string
  title: string
}

const cardVariants: Record<CardsViewVariant, CardVariantStyles> = {
  default: {
    root: 'flex h-full flex-col overflow-hidden',
    content: 'relative flex flex-1 flex-col gap-1 px-4 pt-5 pb-4',
    imageWrapper: 'bg-neutral/30 overflow-hidden rounded-lg',
    image: 'block h-full w-full object-cover',
    category:
      'border-light-gray absolute top-0 left-3 inline -translate-y-1/2 rounded-md border bg-white px-3 text-sm',
    title: '',
  },
  'full-width': {
    root: 'flex h-fit max-[500px]:flex-col',
    content: 'flex min-w-0 flex-col gap-1 px-6 py-4 max-[500px]:px-4',
    imageWrapper:
      'bg-neutral/30 w-45 shrink-0 overflow-hidden rounded-lg max-[500px]:h-44 max-[500px]:w-full',
    image: 'block h-full w-full object-cover',
    category: 'text-sm font-medium text-gray',
    title: 'truncate',
  },
}

export function Card({
  variant = 'default',
  id,
  category,
  title,
  price,
  needsRevision,
}: CardProps) {
  const styles = cardVariants[variant]
  const categoryLabel = CATEGORY_LABELS[category]

  return (
    <Link to={`/ads/${id}`} aria-label={`Open ad: ${title}`}>
      <section
        className={cn(
          'border-neutral rounded-2xl border bg-white transition-shadow hover:shadow-sm',
          styles.root,
        )}
      >
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            src='/placeholder-img.png'
            alt='Cover'
          />
        </div>
        <div className={styles.content}>
          <div className={styles.category}>{categoryLabel}</div>
          <h2 className={styles.title}>{title}</h2>
          <p className='font-semibold text-black/45'>{formatPrice(price)}</p>
          {needsRevision && (
            <div className='bg-light-yellow mt-auto flex w-fit items-center gap-2 rounded-lg px-2 py-0.5'>
              <span className='bg-yellow size-1.5 rounded-full' />
              <p className='text-yellow truncate text-sm'>Требует доработок</p>
            </div>
          )}
        </div>
      </section>
    </Link>
  )
}
