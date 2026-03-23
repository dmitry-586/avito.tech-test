import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers'
import { appRouter } from './router'
import './styles/global.css'

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
        <RouterProvider router={appRouter} />
      </Suspense>
    </AppProviders>
  )
}
