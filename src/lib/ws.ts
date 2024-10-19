import type { ServerWebSocket } from 'bun'
import type { Context } from 'hono'
import type { WSEvents } from 'hono/ws'

import { pub, sub } from './redis'

type WSMessage = {
    type: 'message'
    data: string
}

export const wsHandler = (c: Context): WSEvents<ServerWebSocket> | Promise<WSEvents<ServerWebSocket>> => ({
    onOpen: (evt, ws) => {
        console.log('WebSocket connection opened')

        ws.raw?.subscribe('chat')

        sub.subscribe('MESSAGE')
        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGE') {
                console.log('message received from redis: ', message)
                ws.raw?.publish('chat', message)
            }
        })
    },

    onMessage: async (msg, ws) => {
        const { type, data } = JSON.parse(msg.data.toString()) as WSMessage
        console.log(data)

        const isConnectd = ws.readyState === 1

        if (isConnectd) {
            if (type === 'message' && data) {
                const message = JSON.stringify({ type: 'message', data })
                await pub.publish('MESSAGE', message)
            }
        }
    },

    onClose: (evt, ws) => {
        console.log('ws closed')
        const isConnectionClose = ws.readyState === 3

        if (isConnectionClose && ws.raw) {
            ws.raw.unsubscribe('chat')
        }
    },

    onError: (evt, ws) => {
        console.log('ws error')
    }
})
