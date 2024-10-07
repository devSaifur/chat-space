import { eq } from 'drizzle-orm'

import { db } from '../services/pg'
import { users, type User } from '../services/pg/schema'

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({
        where: eq(users.email, email)
    })
}

export async function createUser(user: User) {
    await db.insert(users).values(user)
}
