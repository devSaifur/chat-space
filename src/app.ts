import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
// import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { handleRedisMessageSubscription } from './features/chat'
import { wsHandler } from './lib/ws'
import { authMiddleware } from './middleware'
import { authRoutes } from './routes/authRoutes'
import { contactsRoutes } from './routes/contactRoutes'
import { messagesRoutes } from './routes/messagesRoutes'

const app = new Hono()

export const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app })

app.use(logger())
// app.use(csrf())

app.use(cors({ origin: '*' })) // TODO: Remove this on production

app.use('*', authMiddleware)

const apiServer = app
    .basePath('/api')
    .route('/auth', authRoutes)
    .route('/contact', contactsRoutes)
    .route('/messages', messagesRoutes)

app.get('/', upgradeWebSocket(wsHandler))

// handleRedisMessageSubscription()

export type ApiServer = typeof apiServer

export default app
