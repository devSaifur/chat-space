import type { InferResponseType } from 'hono/client'

import type { api } from '@/lib/api'

export type Contact = InferResponseType<typeof api.contacts.$get>[number]
