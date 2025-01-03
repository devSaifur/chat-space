import { serveStatic } from '@hono/node-server/serve-static'
import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { rabbitMQService } from './lib/rabbitMq'
import { apiRatelimit } from './lib/rate-limit'
import { handleRedisMessageSubscription } from './lib/redis'
import { wsHandler } from './lib/ws'
import { authMiddleware } from './middleware'
import { authRoutes, sessionRoutes } from './routes/authRoutes'
import { contactsRoutes } from './routes/contactsRoutes'
import { messagesRoutes } from './routes/messagesRoutes'
import { usersRoutes } from './routes/usersRoutes'

const app = new Hono()

export const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app })

app.use(logger())
app.use(csrf())

app.use('/api/*', authMiddleware)
app.use('/api/*', apiRatelimit)

const apiServer = app
    .basePath('/api')
    .route('/auth', authRoutes)
    .route('/session', sessionRoutes)
    .route('/users', usersRoutes)
    .route('/contacts', contactsRoutes)
    .route('/messages', messagesRoutes)

apiServer.get('/', upgradeWebSocket(wsHandler as any))

async function initServices() {
    try {
        await handleRedisMessageSubscription()
        await rabbitMQService.startConsuming()
    } catch (err) {
        console.error(err)
    }
}

initServices()

app.onError((err, c) => {
    console.log(`Error: ${err.message}`)
    return c.json({ error: 'Something went wrong' }, 500)
})

app.use('*', serveStatic({ root: './public' }))

export type ApiServer = typeof apiServer

export default app
