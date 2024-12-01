import type { ApiServer } from '@server/app'
import { hc } from 'hono/client'

export const api = hc<ApiServer>('http://localhost:3000').api
