// @ts-nocheck
// This file is full of ts errors, but it works fine
import { rateLimiter, webSocketLimiter } from 'hono-rate-limiter'
import { RedisStore } from 'rate-limit-redis'

import { redisClient } from './redis'

const sendCommand = (...args) => redisClient.call(...args)

export const apiRatelimit = rateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '', // limit by ip

    store: new RedisStore({
        sendCommand,
        prefix: 'ratelimit-api:'
    })
})

export const wsRateLimit = webSocketLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 5 minutes).
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '', // Method to generate custom identifiers for clients.

    store: new RedisStore({
        sendCommand,
        prefix: 'ratelimit-ws:'
    })
})
