import * as React from 'react'

import { ThemeProvider } from '@/components/providers/theme-provider'

import { ReactQueryProvider } from './react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  )
}
