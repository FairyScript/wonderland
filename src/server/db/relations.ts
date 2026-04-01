import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, r => ({
  userTable: {
    inviter: r.one.userTable({
      from: r.userTable.invitedBy,
      to: r.userTable.id,
    }),
    sessions: r.many.sessionTable(),
  },
  theradTable: {
    block: r.one.blockTable({
      from: r.theradTable.blockId,
      to: r.blockTable.id,
    }),
  },
}))
