import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
    id: varchar('id', { length: 126 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    email: varchar('email', { length: 126 }).notNull(),
    password: varchar('password', { length: 100 }).notNull()
})

export type User = typeof users.$inferSelect

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
