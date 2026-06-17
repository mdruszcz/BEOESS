import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma, no bcrypt here).
// The Credentials provider's authorize() lives in auth.ts, which runs in Node.
export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    // Persist role + status onto the JWT at sign-in.
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.status = (user as { status?: string }).status;
      }
      return token;
    },
    // Expose role + status to the session object.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as { role?: string }).role = token.role as string | undefined;
        (session.user as { status?: string }).status = token.status as string | undefined;
      }
      return session;
    },
  },
  providers: [], // declared in auth.ts
} satisfies NextAuthConfig;
