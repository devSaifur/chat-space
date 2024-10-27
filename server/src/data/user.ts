import { and, eq, getTableColumns, ne, notInArray } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contacts, users, type UserInsert } from '../lib/pg/schema'

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({
        where: eq(users.email, email)
    })
}

export async function createUser(user: UserInsert) {
    await db.insert(users).values(user)
}

export async function getAllUsers(userId: string) {
    const existingContacts = await db
        .select({ contactId: contacts.contactId })
        .from(contacts)
        .where(eq(contacts.userId, userId))

    const { id, password, createdAt, ...rest } = getTableColumns(users)
    return await db
        .select({
            ...rest
        })
        .from(users)
        .where(
            and(ne(users.id, userId), notInArray(users.id, [...existingContacts.map((contact) => contact.contactId)]))
        )
}

export async function getUserByUsername(username: string) {
    return await db.query.users.findFirst({
        where: eq(users.username, username)
    })
}
