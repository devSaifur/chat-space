import { eq } from 'drizzle-orm'

import { db } from '../services/pg'
import { users, type User } from '../services/pg/schema'

export async function getUserByEmail(email: string) {
    return (await db.select().from(users).where(eq(users.email, email))).at(0)
}

export async function createUser(user: User) {
    await db.insert(users).values(user)
}
