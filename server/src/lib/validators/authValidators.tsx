import * as z from 'zod'

export const loginSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address'
    }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .max(100, { message: 'Name must be less than 100 characters' }),
    username: z
        .string()
        .min(1, { message: 'Username is required' })
        .max(100, { message: 'Username must be less than 100 characters' }),
    email: z.string().email({
        message: 'Please enter a valid email address'
    }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export type RegisterSchema = z.infer<typeof registerSchema>
