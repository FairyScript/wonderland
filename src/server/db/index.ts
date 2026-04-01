import { drizzle } from 'drizzle-orm/pglite'
import { relations } from './relations'

const db = drizzle('data.db', { relations })

export default db
