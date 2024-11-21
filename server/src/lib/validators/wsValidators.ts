import * as z from 'zod'

export const wsMessageSchema = z.object({
    type: z.enum(['status', 'message']),
    message: z.string().min(1),
    senderId: z.string(),
    receiverId: z.string(),
    sentAt: z.string().default(new Date().toISOString())
})

export type WSMessageSchema = z.infer<typeof wsMessageSchema>
