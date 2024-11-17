import { Hono } from 'hono'

import { getAllUsers } from '../data/user'
import { getUser } from '../middleware'

export const usersRoutes = new Hono().get('/', getUser, async (c) => {
    const forUserId = c.get('user').id

    try {
        const users = await getAllUsers(forUserId)
        return c.json(users, 200)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Something went wrong' }, 500)
    }
})
