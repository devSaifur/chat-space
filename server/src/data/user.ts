import { and, eq, getTableColumns, ne, notInArray } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contact, user } from '../lib/pg/schema'

export async function getUserByEmail(email: string) {
    return db.query.user.findFirst({
        where: eq(user.email, email)
    })
}

export async function getAllUsers(userId: string) {
    const existingContacts = await db
        .select({ contactId: contact.contactId, userId: user.id })
        .from(contact)
        .where(eq(contact.userId, userId))

    const { id, createdAt, ...rest } = getTableColumns(user)
    return db
        .select({
            ...rest
        })
        .from(user)
        .where(
            and(
                ne(user.id, userId),
                notInArray(user.id, [...existingContacts.map((contact) => contact.contactId || contact.userId)])
            )
        )
}
