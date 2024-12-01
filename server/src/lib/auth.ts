import { hash as argon2hash, verify as argon2verify } from '@node-rs/argon2'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from './pg'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true,
        maxPasswordLength: 100,
        minPasswordLength: 6,
        password: {
            hash(password) {
                return argon2hash(password)
            },
            verify(hash, password) {
                return argon2verify(hash, password)
            }
        }
    },
    trustedOrigins: ['http://localhost:5173']
})
