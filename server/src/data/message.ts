import { and, eq } from 'drizzle-orm'

import { db } from '../lib/pg'
import { contacts, messages } from '../lib/pg/schema'

export async function getMessagesOfUser(senderId: string, receiverId: string) {
    return await db
        .select()
        .from(messages)
        .where(and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)))
}
