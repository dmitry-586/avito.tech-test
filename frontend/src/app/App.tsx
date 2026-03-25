import '@mantine/notifications/styles.css'
import { Suspense } from 'react'
import { PageLoadingState } from '@/shared/ui'
import './global.css'
import { AppProviders } from './providers'
import { AppRouter } from './router'

export function App() {
  return (
    <AppProviders>
      <Suspense fallback={<PageLoadingState />}>
        <AppRouter />
      </Suspense>
    </AppProviders>
  )
}
