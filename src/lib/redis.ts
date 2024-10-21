import Redis from 'ioredis'

import { broadcastMessage } from './ws'

export const pub = new Redis(6379, '127.0.0.1', {
    password: process.env.REDIS_PASSWORD
})

export const sub = new Redis(6379, '127.0.0.1', {
    password: process.env.REDIS_PASSWORD
})
