import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { addContact, getAllUserContacts } from '../data/contact'
import { getAllUsers, getUserByUsername } from '../data/user'
import { getUser } from '../middleware'
import type { Env } from '../types'

type Message = {
    id: number
    sender: 'user' | 'contact'
    content: string
    time: string
}

type Contact = {
    id: number
    name: string
    username: string
    avatar: string
    lastMessage: string
    time: string
    messages: Message[]
}

export const contactsRoutes = new Hono<Env>()
    .get('/', getUser, async (c) => {
        const user = c.get('user')

        const userContacts = await getAllUserContacts(user.id)

        console.dir(userContacts, {
            depth: Infinity,
            numericSeparater: true
        })

        const filteredContacts = userContacts.map((contact) => {
            const { user, messages } = contact
            return {
                ...user,
                lastMessage: messages?.content || null,
                time: messages?.sentAt || null
            }
        })

        return c.json(filteredContacts, 200)
    })
    .post('/add', getUser, zValidator('param', z.string().min(1).max(20)), async (c) => {
        const username = c.req.valid('param')
        const user = c.get('user')

        const toBeAddedUser = await getUserByUsername(username)

        if (!toBeAddedUser) {
            return c.json({ error: 'User not found' }, 404)
        }

        await addContact(user.id, toBeAddedUser.id)
        return c.json({ message: 'Contact added successfully' }, 201)
    })
