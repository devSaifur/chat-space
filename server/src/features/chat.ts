import { pub, sub } from '../lib/redis'
import { broadcastMessage } from '../lib/ws'

export async function handleRedisMessageSubscription() {
    try {
        await sub.subscribe('MESSAGE')
    } catch (err) {
        console.error('Error subscribing to Redis:', err)
    }

    sub.on('message', (channel, message) => {
        if (channel === 'MESSAGE') {
            console.log('message received from redis: ', message)
            broadcastMessage(message)
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
