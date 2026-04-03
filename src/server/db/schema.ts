import { sql } from 'drizzle-orm'
import {
  text,
  jsonb,
  boolean,
  uuid,
  varchar,
  pgSchema,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core'

const p = pgSchema('wonderland')

const userStatusEnum = p.enum('user_status', ['active', 'inactive', 'banned'])
export type UserStatus = (typeof userStatusEnum.enumValues)[number]

const userRoleEnum = p.enum('user_role', ['user', 'admin', 'superadmin'])
export type UserRole = (typeof userRoleEnum.enumValues)[number]

const uuidv7 = sql`uuidv7()`

/** 用户表 */
export const userTable = p.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 32 }).notNull().unique(),
  password: varchar('password', { length: 128 }).notNull(),
  email: varchar('email', { length: 64 }).unique(),
  status: userStatusEnum('status').default('active'),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  invitedBy: uuid('invited_by').notNull(),
})

/** 用户登录历史 */
export const userLoginHistoryTable = p.table('user_login_history', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => userTable.id),
  loginAt: timestamp('login_at').defaultNow(),
  ip: text('ip').notNull(),
})

/** 会话表 */
export const biscuitTable = p.table('biscuits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 16 }).notNull(),
  pubKey: text('pubkey').notNull(),
  exp: timestamp('timestamp').defaultNow(),
})

export const userbiscuitTable = p.table('user_biscuits', {
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  biscuitId: uuid('biscuit_id')
    .notNull()
    .unique()
    .references(() => biscuitTable.id),
})

export const theradTable = p.table('therads', {
  id: uuid('id').primaryKey().default(uuidv7),
  blockId: uuid('block_id').notNull(),
  parentId: uuid('parent_id').notNull(),
  biscuitId: uuid('biscuit_id')
    .notNull()
    .references(() => biscuitTable.id),
  deleted: boolean('deleted').notNull().default(false),
  feature: jsonb('feature').notNull().default({
    lock: false,
    hide: false,
  }),
})

export const blockTable = p.table('blocks', {
  id: uuid('id').primaryKey().default(uuidv7),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  biscuitId: uuid('biscuit_id')
    .notNull()
    .references(() => biscuitTable.id),
  sig: text('sig').notNull(),
})

export const inviteCodeTable = p.table('invite_codes', {
  id: uuid('id').primaryKey().default(uuidv7),
  code: varchar('code', { length: 16 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').notNull().default(false),
  usedBy: uuid('used_by').references(() => userTable.id),
  inviterId: uuid('inviter_id')
    .notNull()
    .references(() => userTable.id),
})
