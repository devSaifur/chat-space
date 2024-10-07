import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { authMiddleware } from './middleware'
import { authRoutes } from './routes/authRoutes'
import { wsHandler } from './services/ws'

const app = new Hono()

app.use(logger())
app.use(csrf())

app.use('*', authMiddleware)

const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app })

app.get('/', upgradeWebSocket(wsHandler))

const apiServer = app.basePath('/api').route('/auth', authRoutes)

const port = 3000
console.log(`Server is running on port ${port}`)

const server = serve({ fetch: app.fetch, port })

injectWebSocket(server)

export type ApiServer = typeof apiServer

export default server
