import { signOut } from 'next-auth/react'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { isDefined, isNotDefined } from '@typebot.io/lib'
import { setUser as setSentryUser } from '@sentry/nextjs'
import { User } from '../auth/helpers/model'

export const userContext = createContext<{
  user?: User
  isLoading: boolean
  currentWorkspaceId?: string
  logOut: () => void
  updateUser: (newUser: Partial<User>) => void
}>({
  isLoading: false,
  logOut: () => {},
  updateUser: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>()
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>()

  useEffect(() => {
    if (isDefined(user)) return
    setCurrentWorkspaceId(
      localStorage.getItem('currentWorkspaceId') ?? undefined
    )

    if (user) {
      const parsedUser = user as User
      setUser(parsedUser)

      if (parsedUser?.id) {
        setSentryUser({ id: parsedUser.id })
      }
    }
  }, [user])

  const updateUser = (updates: Partial<User>) => {
    if (isNotDefined(user)) return
    const newUser = { ...user, ...updates }
    setUser(newUser)
  }

  const logOut = () => {
    signOut()
    setUser(undefined)
  }

  return (
    <userContext.Provider
      value={{
        user,
        isLoading: false,
        currentWorkspaceId,
        logOut,
        updateUser,
      }}
    >
      {children}
    </userContext.Provider>
  )
}
