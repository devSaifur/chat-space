import * as z from 'zod'

export const wsMessageSchema = z.object({
    type: z.enum(['status', 'message']),
    message: z.string().min(1),
    to: z.string().min(1)
})

export type WSMessageSchema = z.infer<typeof wsMessageSchema>
