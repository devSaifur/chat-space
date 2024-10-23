import Redis from 'ioredis'

export const pub = new Redis(6379, '127.0.0.1')

export const sub = new Redis(6379, '127.0.0.1')

export const redisClient = new Redis(6379, '127.0.0.1')
