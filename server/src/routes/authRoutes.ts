import { zValidator } from '@hono/zod-validator'
import { hash, verify } from '@node-rs/argon2'
import { createId } from '@paralleldrive/cuid2'
import { Hono } from 'hono'

import { createUser, getUserByEmail } from '../data/user'
import { loginSchema, registerSchema } from '../lib/validators/authValidators'
import { getUser } from '../middleware'
import { createSession, generateSessionToken, setSessionTokenCookie } from '../utils/auth'

export const authRoutes = new Hono()
    .post('/login', zValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json')

        const user = await getUserByEmail(email)

        if (!user) {
            return c.json({ message: 'Invalid email or password' }, 401)
        }

        const verifyPassword = await verify(user.password, password)

        if (!verifyPassword) {
            return c.json({ message: 'Invalid email or password' }, 401)
        }

        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.id)
        setSessionTokenCookie(c, sessionToken, session.expiresAt)

        return c.body('Login successful', 201)
    })
    .post('/register', zValidator('json', registerSchema), async (c) => {
        const user = c.req.valid('json')

        const userExists = await getUserByEmail(user.email)
        if (userExists) {
            return c.json({ message: 'User already exists' }, 400)
        }

        const hashedPassword = await hash(user.password)

        const userId = createId()

        await createUser({ ...user, id: userId, password: hashedPassword })

        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, userId)
        setSessionTokenCookie(c, sessionToken, session.expiresAt)

        return c.body('Register successful', 201)
    })
    .get('/me', getUser, (c) => {
        const user = c.var.user

        return c.json(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            200
        )
    })
