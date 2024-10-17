import type { ServerWebSocket } from 'bun'
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { wsHandler } from './lib/ws'
import { authMiddleware } from './middleware'
import { authRoutes } from './routes/authRoutes'

const app = new Hono()

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>()

app.use(logger())
app.use(csrf())

app.use(cors({ origin: '*' })) // TODO: Remove this on production

app.use('*', authMiddleware)

const apiServer = app.basePath('/api').route('/auth', authRoutes)

app.get('/', upgradeWebSocket(wsHandler))

const port = 3000
console.log(`Server is running on port ${port}`)

export type ApiServer = typeof apiServer

export default { fetch: app.fetch, websocket }
