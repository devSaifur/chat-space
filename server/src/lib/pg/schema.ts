import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { boolean, pgTable, serial, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull(),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull()
})

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
        .notNull()
        .references(() => users.id)
})

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull()
})

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt')
})

export const usersRelations = relations(users, ({ many, one }) => ({
    contacts: one(contacts, {
        fields: [users.id],
        references: [contacts.userId]
    }),
    messages: one(messages, { fields: [users.id], references: [messages.senderId] })
}))

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

export const contactsRelations = relations(contacts, ({ one }) => ({
    user: one(users, {
        fields: [contacts.userId],
        references: [users.id]
    })
}))

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    senderId: varchar('sender_id', { length: 126 })
        .references(() => users.id)
        .notNull(),
    receiverId: varchar('receiver_id', { length: 126 })
        .references(() => users.id)
        .notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull()
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

export type User = InferSelectModel<typeof users>
export type UserInsert = InferInsertModel<typeof users>
