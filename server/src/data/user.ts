import { and, eq, getTableColumns, ne, notInArray, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contact, user } from '../lib/pg/schema'

export async function getUserByEmail(email: string) {
    return db.query.user.findFirst({
        where: eq(user.email, email)
    })
}

export async function getAllUsers(userId: string) {
    const existingContacts = await db
        .select({ contactId: contact.contactId, userId: contact.userId })
        .from(contact)
        .where(or(eq(contact.userId, userId), eq(contact.contactId, userId)))

    const { id, createdAt, ...rest } = getTableColumns(user)

    return db
        .select({
            ...rest
        })
        .from(user)
        .where(
            notInArray(user.id, [...existingContacts.flatMap((contact) => [contact.contactId, contact.userId]), userId])
        )
}
