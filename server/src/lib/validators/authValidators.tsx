import * as v from 'valibot'

export const loginSchema = v.object({
    email: v.pipe(v.string('Invalid email'), v.nonEmpty('Please enter your email'), v.email('Invalid email')),
    password: v.pipe(
        v.string('Invalid password'),
        v.nonEmpty('Please enter your password'),
        v.minLength(8, 'Password must be at least 8 characters')
    )
})

export type LoginSchema = v.InferOutput<typeof loginSchema>

export const registerSchema = v.object({
    name: v.pipe(
        v.string('Invalid name'),
        v.nonEmpty('Please enter your name'),
        v.minLength(2, 'Name must be at least 2 characters')
    ),
    username: v.pipe(
        v.string('Invalid username'),
        v.nonEmpty('Please enter your username'),
        v.minLength(2, 'Username must be at least 2 characters')
    ),
    email: v.pipe(v.string('Invalid email'), v.nonEmpty('Please enter your email'), v.email('Invalid email')),
    password: v.pipe(
        v.string('Invalid password'),
        v.nonEmpty('Please enter your password'),
        v.minLength(8, 'Password must be at least 8 characters')
    )
})

export type RegisterSchema = v.InferOutput<typeof registerSchema>
