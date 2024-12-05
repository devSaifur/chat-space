import { and, desc, eq, lt, or } from 'drizzle-orm'

import { db } from '../lib/pg'
import { message } from '../lib/pg/schema'

export async function getMessagesOfUser(userId: string, otherUserId: string, cursor?: number) {
    const messages = await db
        .select()
        .from(message)
        .where(
            and(
                cursor ? lt(message.id, cursor) : undefined,
                or(
                    and(eq(message.senderId, userId), eq(message.receiverId, otherUserId)),
                    and(eq(message.senderId, otherUserId), eq(message.receiverId, userId))
                )
            )
        )
        .limit(15)
        .orderBy(desc(message.id))

    return messages.reverse()
}
