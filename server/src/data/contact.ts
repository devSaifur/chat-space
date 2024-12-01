import { eq, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contact, user } from '../lib/pg/schema'

export async function getAllUserContacts(userId: string) {
    return db
        .select({
            id: user.id,
            name: user.name,
            email: user.email
        })
        .from(user)
        .innerJoin(contact, eq(user.id, contact.userId))
        .where(eq(contact.contactId, userId))
}

export async function addContact(userId: string, contactId: string) {
    await db.insert(contact).values({
        userId,
        contactId
    })
}
