import { createAuthClient } from 'better-auth/react'

export const { signIn, signOut, signUp } = createAuthClient({
  baseURL: 'http://localhost:3000'
})
