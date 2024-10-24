import { eq } from 'drizzle-orm'

import { db } from '../lib/pg'
import { users, type UserInsert } from '../lib/pg/schema'

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({
        where: eq(users.email, email)
    })
}

export async function createUser(user: UserInsert) {
    await db.insert(users).values(user)
}
