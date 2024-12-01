import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { addContact, getAllUserContacts } from '../data/contact'
import { getUserByEmail } from '../data/user'
import { getUser } from '../middleware'
import type { ENV } from '../types'

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

export const contactsRoutes = new Hono<ENV>()
    .get('/', getUser, async (c) => {
        const user = c.get('user')

        const userContacts = await getAllUserContacts(user.id)

        return c.json(userContacts, 200)
    })
    .post('/add', getUser, zValidator('json', z.string().email()), async (c) => {
        const email = c.req.valid('json')
        const user = c.get('user')

        const toBeAddedUser = await getUserByEmail(email)

        if (!toBeAddedUser) {
            return c.json({ error: 'User not found' }, 404)
        }

        await addContact(user.id, toBeAddedUser.id)
        return c.json({ message: 'Contact added successfully' }, 201)
    })
