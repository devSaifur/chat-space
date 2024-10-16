import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/services/pg/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})
