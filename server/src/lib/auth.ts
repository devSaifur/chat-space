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
        minPasswordLength: 6
    },
    trustedOrigins: ['http://localhost:5173']
})
