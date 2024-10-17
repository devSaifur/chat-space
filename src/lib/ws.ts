import type { ServerWebSocket } from 'bun'
import type { Context } from 'hono'
import type { WSEvents } from 'hono/ws'

export const wsHandler = (c: Context): WSEvents<ServerWebSocket> | Promise<WSEvents<ServerWebSocket>> => ({
    onOpen: (evt, ws) => {
        console.log('ws opened')
        ws.send('Websocket server connected')
    },
    onMessage: (msg, ws) => {
        ws.send(msg.data.toString())
    },
    onClose: (evt, ws) => {
        console.log('ws closed')
    },
    onError: (evt, ws) => {
        console.log('ws error')
    }
})
