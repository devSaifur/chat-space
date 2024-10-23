import { queryOptions } from '@tanstack/react-query'

import { api } from './api'

export const userQueryOption = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await api.auth.me.$get()
    if (!res.ok) {
      return null
    }
    const user = await res.json()
    return user
  },
  staleTime: Infinity
})
