import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root
})

function Root() {
  return (
    <>
      <Outlet />
      <Toaster richColors />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  )
}
