import { Hono } from 'hono'

import { contacts } from './contactRoutes'

export const messagesRoutes = new Hono().get('/:username', (c) => {
    const username = c.req.param('username')

    const messages = contacts.find((contact) => contact.username === username)?.messages

    if (!messages || messages.length === 0) {
        return c.json({ message: 'User not found' }, 404)
    }

    return c.json(messages, 200)
})
