import { pgTable, text, date, pgEnum, jsonb } from 'drizzle-orm/pg-core'

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'inactive',
  'banned',
])

export const userTable = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  status: userStatusEnum('status').default('active'),
  createdAt: date('created_at').defaultNow(),
  invitedBy: text('invited_by').notNull(),
})

export const sessionTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  pubKey: text('pubkey').notNull(),
  exp: date('date').defaultNow(),
})

export const theradTable = pgTable('therads', {
  id: text('id').primaryKey(),
  blockId: text('block_id').notNull(),
  parentId: text('parent_id').notNull(),
  sessionId: text('session_id').notNull(),
})

export const blockTable = pgTable('blocks', {
  id: text('id').primaryKey(),
  content: jsonb('content').notNull(),
  createdAt: date('created_at').defaultNow(),
  sessionId: text('session_id').notNull(),
  sig: text('sig').notNull(),
})
