import { drizzle } from 'drizzle-orm/bun-sql'
import { relations } from './relations'

const db = drizzle('data.db', { relations })

export default db
