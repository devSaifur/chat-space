import { createAuthClient } from 'better-auth/react'

export const { signIn, signOut, signUp, useSession, $Infer } = createAuthClient(
  {
    baseURL: '/'
  }
)

export type AuthState = typeof $Infer.Session.user
