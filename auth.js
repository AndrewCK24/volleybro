import NextAuth from "next-auth";
import { MongooseAdapter } from "@/src/lib/mongoose-adapter";
import connectToMongoDB from "@/src/infrastructure/mongoose/connect-to-mongodb";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongooseAdapter(connectToMongoDB),
  session: { strategy: "jwt" },
  ...authConfig,
});
