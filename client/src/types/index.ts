import type { InferResponseType } from 'hono/client'

import { api } from '@/lib/api'

const contacts = api.contacts.$get

export type Contact = InferResponseType<typeof contacts>[number]

const msg = api.messages.$get

export type Message = InferResponseType<typeof msg>[number]
