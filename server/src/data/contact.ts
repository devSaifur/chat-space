import { eq, getTableColumns } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contacts, messages, users } from '../lib/pg/schema'

export async function getAllUserContacts(userId: string) {
    return await db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
            lastLogin: users.lastLogin
        })
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .innerJoin(users, eq(users.id, contacts.contactId))
}

export async function addContact(userId: string, contactId: string) {
    await db.insert(contacts).values({
        userId,
        contactId
    })
}
