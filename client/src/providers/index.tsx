import { ThemeProvider } from '@/providers/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { useSession } from '@/lib/auth'

import { routeTree } from '../routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function AppWithProviders() {
  const { data } = useSession()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth: data?.user }} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
