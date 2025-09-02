import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: 'https://tadoo.adith.me'
})

export const {useSession, signOut} = authClient;