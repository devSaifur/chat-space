import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    const user = context.auth
    if (user) {
      throw redirect({
        to: '/'
      })
    }
  },
  component: Outlet
})
