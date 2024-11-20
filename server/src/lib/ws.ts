import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { handleRedisMessagePublishing } from '../lib/redis'
import type { Env } from '../types'
import { getUserIdFromSession } from '../utils/auth'
import { rabbitMQService } from './rabbitMq'
import { WSMessageSchema, wsMessageSchema } from './validators/wsValidators'

type WSRawData = {
    id: string
}

const activeConnections = new Set<WSContext<WSRawData>>()

export function sendMessageToClients(data: string) {
    const { message, to, from } = JSON.parse(data) as WSMessageSchema & { from: string }
    for (const ws of activeConnections) {
        for (const id of [to, from]) {
            if (ws.raw?.id === id) {
                ws.send(JSON.stringify({ type: 'message', message }))
            }
        }
    }
}

export const wsHandler = (c: Context<Env>): WSEvents<WSRawData> => ({
    onOpen: async (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)

        const id = (await validateUser(c, ws)) as string
        ws.raw = {
            id
        }
    },

    onMessage: async (msg, ws) => {
        if (ws.raw && typeof msg.data === 'string') {
            const wsData = JSON.parse(msg.data)
            const validatedFields = wsMessageSchema.safeParse(wsData)

            if (!validatedFields.success) {
                return ws.send(JSON.stringify({ type: 'status', data: 'invalid data' }))
            }

            const { type } = validatedFields.data
            if (type === 'message') {
                const validMessage = JSON.stringify({
                    ...validatedFields.data,
                    from: ws.raw.id
                })
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

async function validateUser(c: Context, ws: WSContext) {
    const session = c.req.header('session') ?? null
    if (!session) {
        ws.send(JSON.stringify({ type: 'status', message: 'unauthorized' }))
        return ws.close()
    }
    const id = await getUserIdFromSession(session)
    if (!id) {
        ws.send(JSON.stringify({ type: 'status', message: 'unauthorized' }))
        return ws.close()
    }
    return id
}
