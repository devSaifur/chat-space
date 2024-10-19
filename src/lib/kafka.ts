import { Kafka, type Producer } from 'kafkajs'

const kafka = new Kafka({
    brokers: ['localhost:9092']
})

let producerInstance: Producer | null = null

async function getProducer() {
    if (!producerInstance) {
        try {
            const producer = kafka.producer()
            await producer.connect()
            producerInstance = producer
        } catch (err) {
            console.error('Error connecting to Kafka:', err)
        }
    }
    return producerInstance
}

export async function produceMessage(msg: string) {
    try {
        const producer = await getProducer()
        if (!producer) throw new Error('Producer not found')

        await producer.send({
            messages: [{ key: `message-${Date.now()}`, value: msg }],
            topic: 'MESSAGES'
        })
    } catch (err) {
        console.error('Error producing message:', err)
    }
}
