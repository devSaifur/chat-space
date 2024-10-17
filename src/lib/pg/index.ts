import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const queryClient = postgres('postgres://postgres:adminadmin@0.0.0.0:5432/db')

export const db = drizzle(queryClient, { schema })
