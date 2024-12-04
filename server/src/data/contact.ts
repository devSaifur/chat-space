import { and, eq, ne, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contact, user } from '../lib/pg/schema'

export async function getAllUserContacts(userId: string) {
    return db
        .select({
            id: user.id,
            name: user.name,
            email: user.email
        })
        .from(contact)
        .innerJoin(user, and(or(eq(user.id, contact.userId), eq(user.id, contact.contactId)), ne(user.id, userId)))
        .where(or(eq(contact.userId, userId), eq(contact.contactId, userId)))
}

export async function addContact(userId: string, contactId: string) {
    await db.insert(contact).values({
        userId,
        contactId
    })
}

export async function checkUserAlreadyInContact(userId: string, contactId: string) {
    const [existingContact] = await db
        .select()
        .from(contact)
        .where(
            or(
                and(eq(contact.userId, userId), eq(contact.contactId, contactId)),
                and(eq(contact.userId, contactId), eq(contact.contactId, userId))
            )
        )

    return existingContact ? true : false
}
