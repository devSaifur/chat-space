import { queryOptions } from '@tanstack/react-query'

import { api } from './api'

export const userQueryOption = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await api.auth.me.$get()
    if (!res.ok) {
      return null
    }
    return await res.json()
  },
  staleTime: Infinity
})

export const contactsQueryOption = queryOptions({
  queryKey: ['contacts'],
  queryFn: async () => {
    const res = await api.contacts.$get()
    if (!res.ok) {
      return null
    }
    return await res.json()
  },
  staleTime: Infinity
})
