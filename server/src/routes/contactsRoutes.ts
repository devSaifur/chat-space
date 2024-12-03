import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { addContact, checkUserAlreadyInContact, getAllUserContacts } from '../data/contact'
import { getUserByEmail } from '../data/user'
import { getUser } from '../middleware'
import type { ENV } from '../types'

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

        if (await checkUserAlreadyInContact(user.id, toBeAddedUser.id)) {
            return c.json({ message: 'Contact already exists' }, 200)
        }

        await addContact(user.id, toBeAddedUser.id)
        return c.json({ message: 'Contact added successfully' }, 201)
    })
