import { PageErrorState, PageLoadingState } from '@/shared/ui'

interface AdDetailsErrorStateProps {
  message: string
}

export function AdDetailsErrorState({ message }: AdDetailsErrorStateProps) {
  return (
    <PageErrorState
      title='Карточка объявления'
      message={message}
      backHref='/ads'
      backLabel='К списку'
    />
  )
}

export function AdDetailsLoadingState() {
  return <PageLoadingState />
}
