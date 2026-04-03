import Elysia, { status } from 'elysia'
import { verifyUserSession } from './valkey'

export const authMacro = new Elysia({ name: 'auth-macro' }).macro({
  isAuth: {
    beforeHandle: async ({ cookie: { session } }) => {
      if (!session?.value) {
        throw status(401, 'Unauthorized')
      }
    },
    resolve: async ({ cookie: { session } }) => {
      const sessionToken = session!.value as string

      const sessionData = await verifyUserSession(sessionToken)
      if (!sessionData) {
        throw status(401, 'Unauthorized')
      }

      return {
        user: sessionData,
      }
    },
  },
})
