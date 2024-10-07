import * as z from 'zod'

export const loginSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address'
    }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email({
        message: 'Please enter a valid email address'
    }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export type RegisterSchema = z.infer<typeof registerSchema>
