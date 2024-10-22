import type { User } from '../lib/pg/schema'

export type Env = {
    Variables: {
        user: User
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            REDIS_PASSWORD: string
            NODE_ENV: 'development' | 'production'
        }
    }
}
