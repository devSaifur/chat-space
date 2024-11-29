import { queryOptions } from '@tanstack/react-query'

import { api } from './api'

export const contactsQueryOption = queryOptions({
  queryKey: ['contacts'],
  queryFn: async () => {
    const res = await api.contacts.$get()
    if (!res.ok) {
      return null
    }
    return res.json()
  },
  staleTime: Infinity
})
