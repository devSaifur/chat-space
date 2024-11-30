import * as z from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters')
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    name: z.string().min(1, 'Please enter your name').min(3, 'Name must be at least 3 characters long'),
    email: z.string().min(1, 'Please enter your email').email('Invalid email'),
    password: z.string().min(1, 'Please enter your password').min(8, 'Password must be at least 8 characters')
})

export type RegisterSchema = z.infer<typeof registerSchema>
