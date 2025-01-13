import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * For more information on the configuration, see: https://authjs.dev/guides/edge-compatibility#split-config
 */
const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // TODO: Remove this option
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.teams = user.teams;
      }
      if (trigger === "update") {
        return { ...token, user: session?.user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.teams = token.teams;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    newUser: "/user/invitations",
  },
} satisfies NextAuthConfig;

export default authConfig;
