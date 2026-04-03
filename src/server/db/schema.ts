import {
  text,
  date,
  jsonb,
  boolean,
  uuid,
  varchar,
  pgSchema,
} from 'drizzle-orm/pg-core'

export const p = pgSchema('wonderland')

export const userStatusEnum = p.enum('user_status', [
  'active',
  'inactive',
  'banned',
])

export const userTable = p.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 32 }).notNull(),
  password: varchar('password', { length: 128 }).notNull(),
  email: varchar('email', { length: 64 }).unique(),
  status: userStatusEnum('status').default('active'),
  createdAt: date('created_at').defaultNow(),
  invitedBy: uuid('invited_by').notNull(),
})

export const sessionTable = p.table('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pubKey: text('pubkey').notNull(),
  exp: date('date').defaultNow(),
})

export const userSessionTable = p.table('user_sessions', {
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  sessionId: uuid('session_id')
    .notNull()
    .unique()
    .references(() => sessionTable.id),
})

export const theradTable = p.table('therads', {
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

export const blockTable = p.table('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: jsonb('content').notNull(),
  createdAt: date('created_at').defaultNow(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessionTable.id),
  sig: text('sig').notNull(),
})

export const inviteCodeTable = p.table('invite_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 16 }).notNull().unique(),
  createdAt: date('created_at').defaultNow(),
  expiresAt: date('expires_at').notNull(),
  used: boolean('used').notNull().default(false),
  usedBy: uuid('used_by').references(() => userTable.id),
  inviterId: uuid('inviter_id')
    .notNull()
    .references(() => userTable.id),
})
