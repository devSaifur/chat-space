import { Hono } from 'hono'

import { getAllUsers } from '../data/user'
import { getUser } from '../middleware'

export const usersRoutes = new Hono().get('/', getUser, async (c) => {
    const forUserId = c.get('user').id

    const users = await getAllUsers(forUserId)
    return c.json(users, 200)
})
