import { CardsFilter, CardsHeader, CardsList } from './ui'

export function AdsListPage() {
  return (
    <>
      <CardsHeader />
      <div className='mt-4 flex gap-6 max-lg:flex-col'>
        <CardsFilter />
        <CardsList />
      </div>
    </>
  )
}
