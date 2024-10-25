import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { handleRedisMessageSubscription } from './features/chat'
import { apiRatelimit } from './lib/rate-limit'
import { wsHandler } from './lib/ws'
import { authMiddleware } from './middleware'
import { authRoutes } from './routes/authRoutes'
import { contactsRoutes } from './routes/contactRoutes'
import { messagesRoutes } from './routes/messagesRoutes'

const app = new Hono()

type User = {
    username: string
}

export const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app })

app.use(logger())
app.use(csrf())

app.use(cors({ origin: '*' })) // TODO: Remove this on production

app.use('/api/*', authMiddleware)
app.use('/api/*', apiRatelimit)

const apiServer = app
    .basePath('/api')
    .route('/auth', authRoutes)
    .route('/contact', contactsRoutes)
    .route('/messages', messagesRoutes)
    .get('/', upgradeWebSocket(wsHandler as any))

// handleRedisMessageSubscription()

export type ApiServer = typeof apiServer

export default app
