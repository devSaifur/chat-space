import type { User } from '../lib/pg/schema'

export type NarrowedUser = Pick<User, 'id' | 'username' | 'email'>

export type Env = {
    Variables: {
        user: NarrowedUser
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
