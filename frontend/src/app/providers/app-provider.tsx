import type { PropsWithChildren } from 'react'

import { AppMantineProvider } from './mantine-provider'
import { QueryProvider } from './query-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppMantineProvider>
      <QueryProvider>
        <main className='mx-auto w-full max-w-350 px-4 py-3 md:px-6 lg:px-8'>
          {children}
        </main>
      </QueryProvider>
    </AppMantineProvider>
  )
}
