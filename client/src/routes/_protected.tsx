import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const user = context.auth
    if (!user) {
      throw redirect({
        to: '/login'
      })
    }
  },
  component: Outlet
})
