import { serve } from '@hono/node-server'

import app, { injectWebSocket } from './app'

const port = 3000
console.log(`Server is running on port ${port}`)

const server = serve(app)

injectWebSocket(server)

export default server
