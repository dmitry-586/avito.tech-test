import { Link, useParams } from 'react-router-dom'

export function AdDetailsPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className='rounded-2xl bg-white p-6'>
      <h2 className='text-xl font-medium'>Карточка объявления</h2>
      <p className='mt-2 text-sm text-black/60'>ID: {id ?? 'unknown'}</p>
      <Link
        to='/ads'
        className='text-blue mt-4 inline-flex rounded-md border border-current px-3 py-1.5 text-sm'
      >
        К списку
      </Link>
    </section>
  )
}
