import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdDetailsErrorStateProps {
  message: string
}

export function AdDetailsErrorState({ message }: AdDetailsErrorStateProps) {
  return (
    <section className='rounded-2xl bg-white p-6'>
      <h2 className='text-xl font-medium'>Карточка объявления</h2>
      <p className='mt-2 text-sm text-black/60'>{message}</p>
      <Link
        to='/ads'
        className='text-blue mt-4 inline-flex rounded-md border border-current px-3 py-1.5 text-sm'
      >
        К списку
      </Link>
    </section>
  )
}

export function AdDetailsLoadingState() {
  return (
    <section className='flex w-full items-center justify-center py-12'>
      <Loader2 className='text-blue size-8 animate-spin' />
    </section>
  )
}
