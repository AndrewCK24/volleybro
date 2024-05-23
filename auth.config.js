import mongoose from "mongoose";
import Google from "next-auth/providers/google";
import connectToMongoDB from "@/lib/connect-to-mongodb";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  events: {
    linkAccount: async ({ user }) => {
      await connectToMongoDB();
      await mongoose.models.User.findByIdAndUpdate(user._id, {
        $set: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        const { password, ...rest } = user._doc;
        token.user = { ...token.user, ...rest };
      }
      if (trigger === "update") {
        return { ...token, user: session?.user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    newUser: "/user/invitations",
  },
};

export default authConfig;
