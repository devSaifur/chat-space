import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { handleRedisMessagePublishing } from '../features/chat'
import type { Env } from '../types'

type WSMessage = {
    type: 'message'
    data: string
}

const activeConnections = new Set<WSContext>()

export function broadcastMessage(data: string) {
    for (const ws of activeConnections) {
        ws.send(data)
    }
}

export const wsHandler = (c: Context<Env>): WSEvents => ({
    onOpen: (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)
        const user = c.get('user')
        console.log({ user })
    },

    onMessage: (msg, ws) => {
        const { type, data } = JSON.parse(msg.data.toString()) as WSMessage
        console.log(data)

        const isConnectd = ws.readyState === 1

        if (isConnectd) {
            if (type === 'message' && data) {
                const message = JSON.stringify({ type: 'message', data })
                // handleRedisMessagePublishing(message)
                broadcastMessage(message)
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
