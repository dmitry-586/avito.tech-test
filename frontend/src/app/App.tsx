import '@mantine/notifications/styles.css'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import './global.css'
import { AppProviders } from './providers'
import { AppRouter } from './router'

export function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <section className='flex w-full items-center justify-center py-50'>
            <Loader2 className='text-blue size-8 animate-spin' />
          </section>
        }
      >
        <AppRouter />
      </Suspense>
    </AppProviders>
  )
}
