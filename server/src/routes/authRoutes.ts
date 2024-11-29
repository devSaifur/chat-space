import { Hono } from 'hono'

import { auth } from '../lib/auth'

export const authRoutes = new Hono()
    .get('/*', (c) => auth.handler(c.req.raw))
    .post('/*', (c) => auth.handler(c.req.raw))
