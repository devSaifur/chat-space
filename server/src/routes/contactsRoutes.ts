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

        return c.json(userContacts, 200)
    })
    .post('/add', getUser, zValidator('json', z.string().min(1).max(20)), async (c) => {
        const username = c.req.valid('json')
        const user = c.get('user')

        const toBeAddedUser = await getUserByUsername(username)

        if (!toBeAddedUser) {
            return c.json({ error: 'User not found' }, 404)
        }

        await addContact(user.id, toBeAddedUser.id)
        return c.json({ message: 'Contact added successfully' }, 201)
    })
