import { getAuthenticatedUser } from '@/features/auth/helpers/utils'

export const useUser = () => {
  const user = getAuthenticatedUser()
  return { user }
}
