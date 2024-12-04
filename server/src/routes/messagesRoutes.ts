import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { getMessagesOfUser } from '../data/message'
import { getUser } from '../middleware'

export const messagesRoutes = new Hono().get(
    '/',
    zValidator('query', z.object({ senderId: z.string().min(1).max(100), cursor: z.string().optional() })),
    getUser,
    async (c) => {
        const { senderId, cursor } = c.req.valid('query')
        const user = c.get('user')

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const messages = await getMessagesOfUser(senderId, user.id, Number(cursor))
        const nextCursor = messages.length === 15 ? messages[messages.length - 1].id : undefined

        return c.json({ nextCursor, messages }, 200)
    }
)
