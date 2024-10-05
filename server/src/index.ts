import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'

import { wsHandler } from './feat/ws'

const app = new Hono()

const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app })

app.get('/', upgradeWebSocket(wsHandler))

const port = 3000
console.log(`Server is running on port ${port}`)

const server = serve({
    fetch: app.fetch,
    port
})

injectWebSocket(server)

export default server
