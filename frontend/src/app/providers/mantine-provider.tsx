import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { PropsWithChildren } from 'react'

export function AppMantineProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider cssVariablesSelector='#root' withGlobalClasses={false}>
      <Notifications
        position='top-right'
        autoClose={3000}
        classNames={{
          root: 'z-[1000]',
          notification: 'border shadow-none px-4 py-2 gap-3 max-w-xs ml-auto',
        }}
      />
      {children}
    </MantineProvider>
  )
}
