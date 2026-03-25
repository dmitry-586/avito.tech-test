import type { ReactNode } from 'react'
import { PageErrorState, PageLoadingState } from './page-state'

interface ItemPageQueryState<TItem> {
  error: Error | null
  id?: string
  isLoading: boolean
  item: TItem | null
}

interface ItemPageTexts {
  backLabel?: string
  invalidId: string
  loadError: string
  title: string
}

interface ItemPageStateProps<TItem> {
  backHref?: string
  children: (params: { id: string; item: TItem }) => ReactNode
  state: ItemPageQueryState<TItem>
  texts: ItemPageTexts
}

export function ItemPageState<TItem>({
  backHref = '/ads',
  children,
  state,
  texts,
}: ItemPageStateProps<TItem>) {
  const { error, id, isLoading, item } = state
  const { backLabel, invalidId, loadError, title } = texts

  if (!id) {
    return (
      <PageErrorState
        title={title}
        message={invalidId}
        backHref={backHref}
        backLabel={backLabel}
      />
    )
  }

  if (isLoading) {
    return <PageLoadingState />
  }

  if (error || !item) {
    return (
      <PageErrorState
        title={title}
        message={loadError}
        backHref={backHref}
        backLabel={backLabel}
      />
    )
  }

  return children({ id, item })
}
