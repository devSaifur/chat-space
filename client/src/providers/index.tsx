import { ThemeProvider } from '@/providers/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '../routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    queryClient
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function AppWithProviders() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ queryClient }} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
