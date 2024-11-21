import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { getMessagesOfUser } from '../data/message'
import { getUser } from '../middleware'

export const messagesRoutes = new Hono().get(
    '/',
    zValidator('query', z.object({ senderId: z.string().min(1).max(100) })),
    getUser,
    async (c) => {
        const { senderId } = c.req.valid('query')
        const user = c.get('user')

        const messages = await getMessagesOfUser(senderId, user.id)

        return c.json(messages, 200)
    }
)
