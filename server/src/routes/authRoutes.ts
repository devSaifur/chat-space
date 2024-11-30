import { Hono } from 'hono'

import { auth } from '../lib/auth'
import type { ENV } from '../types'

export const authRoutes = new Hono().on(['GET', 'POST'], '/*', (c) => auth.handler(c.req.raw))

export const sessionRoutes = new Hono<ENV>().get('/', (c) => {
    const user = c.get('user')

    if (!user) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    return c.json({
        id: user.id,
        name: user.name,
        email: user.email
    })
})
