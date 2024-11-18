import { eq, getTableColumns } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contacts, messages, users } from '../lib/pg/schema'

export async function getAllUserContacts(userId: string) {
    const contact = await db.query.contacts.findMany({
        where: eq(contacts.userId, userId),
        with: {
            contacts: {
                id: true
            },
            messages: true
        }
    })

    return await db
        .select({
            user: {
                id: users.id,
                name: users.name,
                username: users.username,
                lastLogin: users.lastLogin
            },
            messages: {
                content: messages.content,
                sentAt: messages.sentAt,
                receiverId: messages.receiverId,
                senderId: messages.senderId
            }
        })
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .innerJoin(users, eq(users.id, contacts.contactId))
        .leftJoin(messages, eq(messages.receiverId, contacts.userId))
}

export async function addContact(userId: string, contactId: string) {
    await db.insert(contacts).values({
        userId,
        contactId
    })
}
