import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { handleRedisMessagePublishing } from '../lib/redis'
import type { ENV } from '../types'
import { rabbitMQService } from './rabbitMq'
import { WSMessageSchema, wsMessageSchema } from './validators/wsValidators'

type WSRawData = {
    userId: string
}

const activeConnections = new Set<WSContext<WSRawData>>()

export function sendMessageToClients(data: string) {
    const { message, senderId, receiverId } = JSON.parse(data) as WSMessageSchema
    for (const ws of activeConnections) {
        for (const userId of [senderId, receiverId]) {
            if (ws.raw?.userId === userId) {
                ws.send(JSON.stringify({ type: 'message', message, senderId, receiverId }))
            }
        }
    }
}

export const wsHandler = (c: Context<ENV>): WSEvents<WSRawData> => ({
    onOpen: async (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)

        const userId = c.get('user').id
        console.log('userId', userId)

        ws.raw = {
            userId: c.get('user').id
        }
    },

    onMessage: async (msg, ws) => {
        if (ws.raw?.userId && typeof msg.data === 'string') {
            const wsData = JSON.parse(msg.data)
            const validatedFields = wsMessageSchema.safeParse(wsData)

            if (!validatedFields.success) {
                return ws.send(JSON.stringify({ type: 'status', data: 'invalid data' }))
            }

            const { type } = validatedFields.data
            if (type === 'message') {
                const validMessage = JSON.stringify(validatedFields.data)
                try {
                    await handleRedisMessagePublishing(validMessage)
                    await rabbitMQService.publishMessage(validMessage)
                } catch (err) {
                    console.error('Error:', err)
                }
            }
        } else {
            ws.send(JSON.stringify({ type: 'status', message: 'unauthorized' }))
            return ws.close()
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
