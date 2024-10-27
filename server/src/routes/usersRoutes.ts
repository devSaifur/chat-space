import { Hono } from 'hono'

import { getAllUsers } from '../data/user'
import { getUser } from '../middleware'

export const usersRoutes = new Hono().get('/', getUser, async (c) => {
    const userId = c.get('user').id

    const users = await getAllUsers(userId)

    return c.json(users, 200)
})
