// @ts-nocheck

import { rateLimiter } from 'hono-rate-limiter'
import Redis from 'ioredis'
import { RedisStore } from 'rate-limit-redis'

const client = new Redis(6379, '127.0.0.1', {
    password: process.env.REDIS_PASSWORD
})

const sendCommand = (command, ...args) => client.sendCommand(command, ...args)

export const apiRatelimit = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (req) => c.req.header('x-forwarded-for') ?? '', // limit by ip

    store: new RedisStore({
        sendCommand,
        prefix: 'ratelimit:'
    })
})

export const wsLimiter = webSocketLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes).
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '', // Method to generate custom identifiers for clients.

    store: new RedisStore({
        sendCommand,
        prefix: 'ratelimit:'
    })
})