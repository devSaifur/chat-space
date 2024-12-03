import * as amqp from 'amqplib'

import { db } from './pg'
import { message } from './pg/schema'
import { WSMessageSchema } from './validators/wsValidators'

class RabbitMQService {
    private connection: amqp.Connection | null = null
    private channel: amqp.Channel | null = null
    private readonly QUEUE_NAME = 'MESSAGES'

    private async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost:5672')
            this.channel = await this.connection.createChannel()

            await this.channel.assertQueue(this.QUEUE_NAME, {
                durable: false
            })

            console.log('RabbitMQ connected')
        } catch (err) {
            console.error('RabbitMQ connection error:', err)
            setTimeout(() => this.connect(), 5000)
        }
    }

    private async reconnect() {
        try {
            if (this.connection) {
                await this.connection.close()
            }

            await this.connect()
        } catch (err) {
            console.error('RabbitMQ reconnection error:', err)
            setTimeout(() => this.reconnect(), 5000)
        }
    }

    public async publishMessage(msg: string) {
        try {
            if (!this.connection || !this.channel) {
                await this.reconnect()
                return
            }

            this.channel.sendToQueue(this.QUEUE_NAME, Buffer.from(msg), {
                persistent: true
            })
        } catch (err) {
            console.error('RabbitMQ publish error:', err)
            await this.reconnect()
            setTimeout(() => this.publishMessage(msg), 5000)
        }
    }

    public async startConsuming() {
        try {
            if (!this.connection || !this.channel) {
                await this.connect()
            }

            this.channel?.prefetch(1)

            await this.channel?.consume(this.QUEUE_NAME, async (msg) => {
                if (msg) {
                    console.log('QUE MESSAGE', msg.content.toString())
                    try {
                        const content = JSON.parse(msg.content.toString()) as WSMessageSchema
                        await this.processMessage(content)
                        this.channel?.ack(msg)
                    } catch (err) {
                        console.error('RabbitMQ consume error:', err)
                        this.channel?.nack(msg, false, true)
                    }
                }
            })
        } catch (err) {
            console.error('RabbitMQ consume error:', err)
            // Retry consuming after delay
            setTimeout(() => this.startConsuming(), 5000)
        }
    }

    private async processMessage(msg: WSMessageSchema) {
        try {
            await db.insert(message).values({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                sentAt: new Date(msg.sentAt),
                content: msg.message
            })
        } catch (err) {
            console.error('Error processing message:', err)
            throw err
        }
    }
}

export const rabbitMQService = new RabbitMQService()
