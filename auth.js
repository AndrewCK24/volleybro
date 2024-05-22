import NextAuth from "next-auth";
import { MongooseAdapter } from "@/lib/mongoose-adapter";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongooseAdapter(connectToMongoDB),
  session: { strategy: "jwt" },
  ...authConfig,
});
