import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { ObjectId } from "mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/data/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: { strategy: "jwt" },
  events: {
    linkAccount: async ({ user }) => {
      const userId = new ObjectId(user.id);
      await client
        .db()
        .collection("users")
        .updateOne({ _id: userId }, { $set: { emailVerified: new Date() } });
    },
  },
  ...authConfig,
});
