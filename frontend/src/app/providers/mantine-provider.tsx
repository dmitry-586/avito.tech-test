import { MantineProvider } from '@mantine/core'
import type { PropsWithChildren } from 'react'

export function AppMantineProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider cssVariablesSelector='#root' withGlobalClasses={false}>
      {children}
    </MantineProvider>
  )
}
