import {
  pgTable,
  text,
  date,
  pgEnum,
  jsonb,
  boolean,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'inactive',
  'banned',
])

export const userTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 32 }).notNull(),
  password: varchar('password', { length: 128 }).notNull(),
  email: varchar('email', { length: 64 }).unique(),
  status: userStatusEnum('status').default('active'),
  createdAt: date('created_at').defaultNow(),
  invitedBy: uuid('invited_by').notNull(),
})

export const sessionTable = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pubKey: text('pubkey').notNull(),
  exp: date('date').defaultNow(),
})

export const userSessionTable = pgTable('user_sessions', {
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  sessionId: uuid('session_id')
    .notNull()
    .unique()
    .references(() => sessionTable.id),
})

export const theradTable = pgTable('therads', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull(),
  parentId: uuid('parent_id').notNull(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessionTable.id),
  deleted: boolean('deleted').notNull().default(false),
  feature: jsonb('feature').notNull().default({
    lock: false,
    hide: false,
  }),
})

export const blockTable = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: jsonb('content').notNull(),
  createdAt: date('created_at').defaultNow(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessionTable.id),
  sig: text('sig').notNull(),
})
