import type { ServerWebSocket } from 'bun'
import type { Context } from 'hono'
import type { WSEvents } from 'hono/ws'

type WSMessage = {
    type: 'message'
    data: string
}

export const wsHandler = (c: Context): WSEvents<ServerWebSocket> | Promise<WSEvents<ServerWebSocket>> => ({
    onOpen: (evt, ws) => {
        console.log('ws opened')
        ws.raw?.subscribe('chat')
    },
    onMessage: (msg, ws) => {
        const { type, data } = JSON.parse(msg.data.toString()) as WSMessage

        console.log(data)

        if (type === 'message' && data) {
            const message = JSON.stringify({ type: 'message', data })
            ws.raw?.publish('chat', message)
        }
    },
    onClose: (evt, ws) => {
        console.log('ws closed')
    },
    onError: (evt, ws) => {
        console.log('ws error')
    }
})
