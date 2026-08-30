import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { getAuthenticatedGithubUser } from "./lib/github"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("AUTHORIZE CALLED:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user || !user.passwordHash) {
          console.log("User not found or no password hash:", user?.email)
          return null
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        console.log("Password valid:", isPasswordValid)
        if (!isPasswordValid) {
          return null
        }
        console.log("Login successful for:", user.email)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    }),
    CredentialsProvider({
      id: "firebase-github",
      name: "GitHub (Firebase)",
      credentials: {
        idToken: { label: "Firebase ID Token", type: "text" },
        githubAccessToken: { label: "GitHub Access Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.idToken || !credentials?.githubAccessToken) {
          return null
        }

        try {
          // The Firebase ID token proves who signed in; the GitHub access token
          // (obtained client-side via Firebase's GitHub popup flow) lets us call
          // the GitHub API. We cross-check the two so a client can't hand us an
          // arbitrary access token paired with someone else's Firebase session.
          const { verifyFirebaseIdToken } = await import("./lib/firebase-admin")
          const decoded = await verifyFirebaseIdToken(credentials.idToken as string)
          const email = decoded.email
          const verifiedGithubId = (decoded.firebase?.identities?.["github.com"] as string[] | undefined)?.[0]
          if (!email || !verifiedGithubId) return null

          const ghUser = await getAuthenticatedGithubUser(credentials.githubAccessToken as string)
          if (String(ghUser.id) !== verifiedGithubId) return null

          const existing = await prisma.user.findFirst({
            where: {
              OR: [
                { githubId: String(ghUser.id) },
                { email }
              ]
            }
          })

          const user = existing
            ? await prisma.user.update({
                where: { id: existing.id },
                data: {
                  githubId: String(ghUser.id),
                  githubUsername: ghUser.login,
                  githubAccessToken: credentials.githubAccessToken as string,
                  githubAvatarUrl: ghUser.avatar_url
                }
              })
            : await prisma.user.create({
                data: {
                  email,
                  name: ghUser.name || ghUser.login,
                  githubId: String(ghUser.id),
                  githubUsername: ghUser.login,
                  githubAccessToken: credentials.githubAccessToken as string,
                  githubAvatarUrl: ghUser.avatar_url,
                  role: "developer"
                }
              })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        } catch (err) {
          console.error("Firebase GitHub sign-in failed:", err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    }
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || "super-secret-bugradar-key-1234567890"
})
