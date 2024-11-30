import * as amqp from 'amqplib'

import { db } from './pg'
import { messages } from './pg/schema'
import { WSMessageSchema } from './validators/wsValidators'

class RabbitMQService {
    private connection: amqp.Connection | null = null
    private channel: amqp.Channel | null = null
    private readonly QUEUE_NAME = 'MESSAGES'
    private batchSize = 10 // 10 messages
    private timeout = 10000 // 10 seconds

    private async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost:5672')
            this.channel = await this.connection.createChannel()

            await this.channel.assertQueue(this.QUEUE_NAME, {
                durable: false
            })

            await this.channel.prefetch(this.batchSize)

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
                await this.reconnect()
                return
            }

            const messagesBulk = [] as WSMessageSchema[]
            let timer: NodeJS.Timeout

            await this.channel.consume(
                this.QUEUE_NAME,
                async (msg) => {
                    if (msg !== null) {
                        try {
                            const content = JSON.parse(msg.content.toString()) as WSMessageSchema
                            messagesBulk.push(content)
                            this.channel?.ack(msg)

                            if (messagesBulk.length >= this.batchSize) {
                                clearTimeout(timer)
                                await this.processMessage(messagesBulk)
                                messagesBulk.length = 0
                            } else {
                                clearTimeout(timer)
                                timer = setTimeout(async () => {
                                    if (messagesBulk.length > 0) {
                                        await this.processMessage(messagesBulk)
                                        messagesBulk.length = 0
                                    }
                                }, this.timeout)
                            }
                        } catch (err) {
                            console.error('RabbitMQ consume error:', err)
                            this.channel?.nack(msg, false, true)
                        }
                    }
                },
                { noAck: false }
            )
        } catch (err) {
            console.error('RabbitMQ consume error:', err)
            // Retry consuming after delay
            setTimeout(() => this.startConsuming(), 5000)
        }
    }

    private async processMessage(msgs: WSMessageSchema[]) {
        const msgsToBeInserted = msgs.map((m) => ({
            senderId: m.senderId,
            receiverId: m.receiverId,
            sentAt: new Date(m.sentAt),
            content: m.message
        }))

        try {
            await db.insert(messages).values(msgsToBeInserted)
        } catch (err) {
            console.error('Error processing message:', err)
            throw err
        }
    }
}

export const rabbitMQService = new RabbitMQService()
