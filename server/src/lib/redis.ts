import Redis from 'ioredis'

import { sendMessageToClients } from './ws'

const pub = new Redis(6379, '127.0.0.1')
const sub = new Redis(6379, '127.0.0.1')

export const redisClient = new Redis(6379, '127.0.0.1')

export async function handleRedisMessageSubscription() {
    try {
        await sub.subscribe('MESSAGE')
    } catch (err) {
        console.error('Error subscribing to Redis:', err)
    }

    sub.on('message', (channel, message) => {
        if (channel === 'MESSAGE') {
            console.log('message received from redis: ', message)
            sendMessageToClients(message)
        }
    })
}

export async function handleRedisMessagePublishing(msg: string) {
    try {
        await pub.publish('MESSAGE', msg)
    } catch (err) {
        console.error('Error publishing message:', err)
    }
}
