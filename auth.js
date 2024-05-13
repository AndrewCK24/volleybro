import NextAuth from "next-auth";
import { MongooseAdapter } from "@/lib/mongoose-adapter";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongooseAdapter(connectToMongoDB),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { password, ...rest } = user._doc;
        token.user = { ...token.user, ...rest };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  ...authConfig,
});
