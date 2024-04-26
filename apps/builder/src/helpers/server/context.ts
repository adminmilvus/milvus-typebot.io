import { getAuthenticatedUser } from '@/features/auth/helpers/utils'
import { inferAsyncReturnType } from '@trpc/server'

export async function createContext() {
  const user = getAuthenticatedUser()

  return {
    user,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
