import * as amqp from 'amqplib'

import { db } from './pg'
import { messages } from './pg/schema'
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

            this.connection.on('error', async (err) => {
                console.error('RabbitMQ connection error:', err)
                await this.connect()
            })

            console.log('RabbitMQ connected')
        } catch (err) {
            console.error('RabbitMQ connection error:', err)
            // Retry connection after delay
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
            // Retry connection after delay
            setTimeout(() => this.reconnect(), 5000)
        }
    }

    public async publishMessage(msg: string) {
        try {
            if (!this.connection || !this.channel) {
                await this.reconnect()
            }

            this.channel?.sendToQueue(this.QUEUE_NAME, Buffer.from(msg), {
                persistent: true
            })
        } catch (err) {
            console.error('RabbitMQ publish error:', err)
            // Retry publishing after delay
            await this.reconnect()
            setTimeout(() => this.publishMessage(msg), 5000)
        }
    }

    public async startConsuming() {
        try {
            if (!this.connection || !this.channel) {
                await this.reconnect()
            }

            this.channel?.prefetch(1)

            await this.channel?.consume(this.QUEUE_NAME, async (msg) => {
                if (msg) {
                    try {
                        await this.processMessage(msg.content.toString())

                        this.channel?.ack(msg)
                    } catch (err) {
                        console.error('RabbitMQ consume error:', err)
                        this.channel?.reject(msg, true)
                    }
                }
            })
        } catch (err) {
            console.error('RabbitMQ consume error:', err)
            // Retry consuming after delay
            setTimeout(() => this.startConsuming(), 5000)
        }
    }

    private async processMessage(msg: string) {
        const { message, senderId, receiverId, sentAt } = JSON.parse(msg) as WSMessageSchema
        try {
            await db.insert(messages).values({
                senderId,
                receiverId,
                sentAt: new Date(sentAt),
                content: message
            })
        } catch (err) {
            console.error('Error processing message:', err)
            throw err
        }
    }
}

export const rabbitMQService = new RabbitMQService()
