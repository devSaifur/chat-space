import { queryOptions } from '@tanstack/react-query'

import { api } from './api'

export const userQueryOption = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await api.auth.me.$get()
    const user = await res.json()
    if (!user) {
      return null
    }
    return user
  },
  staleTime: Infinity
})
