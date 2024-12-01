import { and, desc, eq, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { message } from '../lib/pg/schema'

export async function getMessagesOfUser(userId: string, otherUserId: string) {
    return db
        .select()
        .from(message)
        .where(
            or(
                and(eq(message.senderId, userId), eq(message.receiverId, otherUserId)),
                and(eq(message.senderId, otherUserId), eq(message.receiverId, userId))
            )
        )
        .limit(10)
        .orderBy(desc(message.id))
}
