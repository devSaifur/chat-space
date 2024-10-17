import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import { generateId } from 'lucia'

import { createUser, getUserByEmail } from '../data-access/user'
import { lucia } from '../lib/auth'
import { loginSchema, registerSchema } from '../lib/validators/authValidators'

export const authRoutes = new Hono()
    .post('/login', vValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json')
        try {
            const existingUser = await getUserByEmail(email)

            if (!existingUser) {
                return c.json({ message: 'Invalid email or password' }, 401)
            }

            const validUser = await Bun.password.verify(password, existingUser.password)

            if (!validUser) {
                return c.json({ message: 'Invalid email or password' }, 401)
            }

            const session = await lucia.createSession(existingUser.id, {})
            c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), { append: true })

            return c.body('Logged in successfully', 200)
        } catch (err) {
            console.error(err)
            return c.body('Internal server error', 500)
        }
    })
    .post('/register', vValidator('json', registerSchema), async (c) => {
        const user = c.req.valid('json')
        try {
            const existingUser = await getUserByEmail(user.email)

            if (existingUser) {
                return c.json({ message: 'User already exists' }, 400)
            }

            const hashedPassword = await Bun.password.hash(user.password)

            const userId = generateId(15)

            await createUser({ ...user, id: userId, password: hashedPassword })

            const session = await lucia.createSession(userId, {})
            c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), { append: true })

            return c.body('Registered successfully', 200)
        } catch (err) {
            console.error(err)
            return c.body('Internal server error', 500)
        }
    })
