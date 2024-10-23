import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import type { Env } from './types'
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from './utils/auth'

export async function authMiddleware(c: Context, next: Next) {
    const token = getCookie(c, 'session') ?? null

    if (!token) {
        c.set('user', null)
        c.set('session', null)
        return next()
    }

    const { session, user } = await validateSessionToken(token)

    if (session) {
        setSessionTokenCookie(c, token, session.expiresAt)
    } else {
        deleteSessionTokenCookie(c)
    }

    c.set('user', user)
    c.set('session', session)
    return next()
}

export const getUser = createMiddleware<Env>(async (c, next) => {
    const user = c.get('user')

    if (!user) {
        return c.json({ status: 401, message: 'Unauthorized' })
    }

    c.set('user', user)
    return next()
})
