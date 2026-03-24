import { cn } from '@/shared/lib'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageErrorStateProps {
  backHref?: string
  backLabel?: string
  className?: string
  message: string
  title: string
}

export function PageErrorState({
  backHref,
  backLabel = 'К списку',
  className,
  message,
  title,
}: PageErrorStateProps) {
  return (
    <section className={cn('rounded-2xl bg-white p-6', className)}>
      <h2 className='text-xl font-medium'>{title}</h2>
      <p className='mt-2 text-sm text-black/60'>{message}</p>

      {backHref ? (
        <Link
          to={backHref}
          className='text-blue mt-4 inline-flex rounded-md border border-current px-3 py-1.5 text-sm'
        >
          {backLabel}
        </Link>
      ) : null}
    </section>
  )
}

interface PageLoadingStateProps {
  className?: string
}

export function PageLoadingState({ className }: PageLoadingStateProps) {
  return (
    <section
      className={cn('flex w-full items-center justify-center py-12', className)}
    >
      <Loader2 className='text-blue size-8 animate-spin' />
    </section>
  )
}
