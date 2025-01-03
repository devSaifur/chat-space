import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/lib/pg/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    casing: 'snake_case'
})
