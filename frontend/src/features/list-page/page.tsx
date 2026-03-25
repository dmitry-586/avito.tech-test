import { useListData } from './model'
import { Filter, Header, List } from './ui'

export function ListPage() {
  const { error, isLoading, items, total } = useListData()

  return (
    <>
      <Header total={total} />
      <div className='mt-4 flex gap-6 max-lg:flex-col'>
        <Filter />
        <List error={error} isLoading={isLoading} items={items} total={total} />
      </div>
    </>
  )
}
