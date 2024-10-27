import { eq } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contacts } from '../lib/pg/schema'

export async function getAllUserContacts(userId: string) {
    return await db.select().from(contacts).where(eq(contacts.userId, userId))
}

export async function addContact(userId: string, contactId: string) {
    await db.insert(contacts).values({
        userId,
        contactId
    })
}
