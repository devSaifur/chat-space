import { createId } from '@paralleldrive/cuid2'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
    id: varchar('id', { length: 126 }).primaryKey(),
    name: varchar('name', { length: 126 }).notNull(),
    username: varchar('username', { length: 126 }).notNull(),
    email: varchar('email', { length: 126 }).notNull(),
    password: varchar('password', { length: 126 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    lastLogin: timestamp('last_login')
})

export const contacts = pgTable(
    'contacts',
    {
        id: serial('id').primaryKey(),
        userId: varchar('user_id', { length: 126 })
            .references(() => users.id)
            .notNull(),
        contactId: varchar('contact_id')
            .references(() => users.id)
            .notNull(),
        createdAt: timestamp('created_at').defaultNow()
    },
    (table) => ({
        uniqueContact: unique().on(table.userId, table.contactId)
    })
)

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    senderId: varchar('sender_id', { length: 126 })
        .references(() => users.id)
        .notNull(),
    receiverId: varchar('receiver_id', { length: 126 })
        .references(() => users.id)
        .notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull(),
    readAt: timestamp('read_at')
})

export const messagesRelations = relations(messages, ({ one }) => ({
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id]
    }),
    receiver: one(users, {
        fields: [messages.receiverId],
        references: [users.id]
    })
}))

export const groups = pgTable('groups', {
    id: varchar('id', { length: 126 })
        .primaryKey()
        .$defaultFn(() => createId()),
    name: varchar('name', { length: 126 }).notNull(),
    createdAt: timestamp('created_at').defaultNow()
})

export const groupMembers = pgTable(
    'group_members',
    {
        id: varchar('id', { length: 126 })
            .primaryKey()
            .$defaultFn(() => createId()),
        groupId: varchar('group_id', { length: 126 })
            .references(() => groups.id)
            .notNull(),
        userId: varchar('user_id', { length: 126 })
            .references(() => users.id)
            .notNull(),
        joinedAt: timestamp('joined_at').defaultNow()
    },
    (table) => ({
        uniqueGroupMember: unique().on(table.groupId, table.userId)
    })
)

export const groupMessages = pgTable('group_messages', {
    id: serial('id').primaryKey(),
    groupId: varchar('group_id', { length: 126 })
        .references(() => groups.id)
        .notNull(),
    senderId: varchar('sender_id', { length: 126 })
        .references(() => users.id)
        .notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow()
})

export const sessions = pgTable('session', {
    id: varchar('id', { length: 126 }).primaryKey(),
    userId: varchar('user_id', { length: 126 })
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull()
})

export type User = InferSelectModel<typeof users>
export type UserInsert = InferInsertModel<typeof users>
export type Session = InferSelectModel<typeof sessions>
