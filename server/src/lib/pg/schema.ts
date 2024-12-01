import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
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
        .references(() => user.id)
})

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => user.id),
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

export const userRelations = relations(user, ({ many, one }) => ({
    contacts: one(contact, {
        fields: [user.id],
        references: [contact.userId]
    }),
    messages: one(message, { fields: [user.id], references: [message.senderId] })
}))

export const contact = pgTable('contacts', {
    id: serial('id').primaryKey(),
    userId: text('user_id')
        .references(() => user.id)
        .notNull(),
    contactId: varchar('contact_id')
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp('created_at').defaultNow()
})

export const contactRelations = relations(contact, ({ one }) => ({
    user: one(user, {
        fields: [contact.userId],
        references: [user.id]
    })
}))

export const message = pgTable('message', {
    id: serial('id').primaryKey(),
    senderId: text('sender_id')
        .references(() => user.id)
        .notNull(),
    receiverId: text('receiver_id')
        .references(() => user.id)
        .notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull()
})

export const messagesRelations = relations(message, ({ one }) => ({
    sender: one(user, {
        fields: [message.senderId],
        references: [user.id]
    }),
    receiver: one(user, {
        fields: [message.receiverId],
        references: [user.id]
    })
}))

export type User = InferSelectModel<typeof user>
