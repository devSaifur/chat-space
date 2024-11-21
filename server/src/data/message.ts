import { and, desc, eq, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { messages } from '../lib/pg/schema'

export async function getMessagesOfUser(userId: string, otherUserId: string) {
    return await db
        .select()
        .from(messages)
        .where(
            or(
                and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
                and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
            )
        )
        .limit(10)
        .orderBy(desc(messages.id))
}
