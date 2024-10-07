import type { Context } from 'hono'
import type { WSEvents } from 'hono/ws'

export const wsHandler = (c: Context): WSEvents | Promise<WSEvents> => ({
    onOpen: (evt) => {
        console.log('ws opened')
    },
    onMessage: (msg, ws) => {
        console.log('ws message', msg)
    },
    onClose: (evt, ws) => {
        console.log('ws closed')
    },
    onError: (evt, ws) => {
        console.log('ws error')
    }
})
