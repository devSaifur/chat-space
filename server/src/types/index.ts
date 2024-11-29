import { auth } from '../lib/auth'

export type User = typeof auth.$Infer.Session.user

export type ENV = {
    Variables: {
        user: User
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            NODE_ENV: 'development' | 'production'
        }
    }
}
