import type { Context } from 'hono'
import type { WSContext, WSEvents } from 'hono/ws'

import { handleRedisMessagePublishing } from '../lib/redis'
import type { Env } from '../types'
import { getUsernameFromSession } from '../utils/auth'
import { WSMessageSchema, wsMessageSchema } from './validators/wsValidators'

type WSRawData = {
    username: string
}

const activeConnections = new Set<WSContext<WSRawData>>()

export function sendMessageToClients(data: string) {
    const { message, to } = JSON.parse(data) as WSMessageSchema & { to: string[] }
    for (const ws of activeConnections) {
        for (const username of to) {
            if (ws.raw?.username === username) {
                ws.send(JSON.stringify({ type: 'message', message }))
            }
        }
    }
}

export const wsHandler = (c: Context<Env>): WSEvents<WSRawData> => ({
    onOpen: async (evt, ws) => {
        console.log('WebSocket connection opened')
        activeConnections.add(ws)

        const username = (await validateUser(c, ws)) as string
        ws.raw = {
            username
        }
    },

    onMessage: (msg, ws) => {
        if (ws.raw && typeof msg.data === 'string') {
            const wsData = JSON.parse(msg.data)

            const validatedFields = wsMessageSchema.safeParse(wsData)

            if (!validatedFields.success) {
                return ws.send(JSON.stringify({ type: 'status', data: 'invalid data' }))
            }

            const { type } = validatedFields.data

            if (type === 'message') {
                handleRedisMessagePublishing(
                    JSON.stringify({
                        ...validatedFields.data,
                        to: [ws.raw.username, validatedFields.data.to]
                    })
                )
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
    const username = await getUsernameFromSession(session)
    if (!username) {
        ws.send(JSON.stringify({ type: 'status', message: 'unauthorized' }))
        return ws.close()
    }
    return username
}
