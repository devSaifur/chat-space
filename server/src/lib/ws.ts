import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { handleRedisMessagePublishing } from '../features/chat'
import type { Env } from '../types'
import { WSMessageSchema, wsMessageSchema } from './validators/wsValidators'

type WSRawData = {
    username: string
}

const activeConnections = new Set<WSContext<WSRawData>>()

export function broadcastMessage(data: string) {
    for (const ws of activeConnections) {
        ws.send(data)
    }
}

export function sendMessage(msg: string, to: string[]) {
    for (const ws of activeConnections) {
        for (const username of to) {
            if (ws.raw?.username === username) {
                ws.send(JSON.stringify({ type: 'message', message: msg }))
            }
        }
    }
}

export const wsHandler = (c: Context<Env>): WSEvents<WSRawData> => ({
    onOpen: (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)

        const user = c.get('user')

        if (!user) {
            ws.send(JSON.stringify({ type: 'status', message: 'unauthorized' }))
            return ws.close()
        }

        ws.raw = {
            username: user.username
        }
    },

    onMessage: (msg, ws) => {
        if (ws.raw && typeof msg.data === 'string') {
            const wsData = JSON.parse(msg.data)

            const validatedFields = wsMessageSchema.safeParse(wsData)
            if (!validatedFields.success) {
                return ws.send(JSON.stringify({ type: 'status', data: 'invalid data' }))
            }

            const { type, message, to } = validatedFields.data
            if (type === 'message') {
                const sendTo = [ws.raw.username, to]
                sendMessage(message, sendTo)
                // handleRedisMessagePublishing(message)
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
