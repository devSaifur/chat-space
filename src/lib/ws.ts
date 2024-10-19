import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { pub, sub } from './redis'

type WSMessage = {
    type: 'message'
    data: string
}

const activeConnections = new Set<WSContext>()

function broadcastMessage(data: string) {
    for (const ws of activeConnections) {
        ws.send(data)
    }
}

export const wsHandler = (c: Context): WSEvents | Promise<WSEvents> => ({
    onOpen: (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)

        sub.subscribe('MESSAGE')

        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGE') {
                console.log('message received from redis: ', message)
                broadcastMessage(message)
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
        activeConnections.delete(ws)
    },

    onError: (evt, ws) => {
        console.log('ws error')
    }
})
