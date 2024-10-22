import type { User } from '../lib/pg/schema'

export type Env = {
    Variables: {
        user: User
    }
}
