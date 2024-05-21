import mongoose from "mongoose";
import { compareSync } from "bcryptjs";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectToMongoDB from "@/lib/connect-to-mongodb";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;

        // // logic to verify if user exists
        await connectToMongoDB();
        user = await mongoose.models.User.findOne({
          email: credentials.email,
        });
        if (!user || !credentials.password) return null;

        // logic to compare password
        const isPasswordCorrect = compareSync(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) return null;

        // return user object with the their profile data
        return user;
      },
    }),
  ],
  events: {
    // signIn: async ({ user, account }) => {
    //   // Allow OAuth providers to sign in without email verification
    //   if (account.provider === "credentials") {
    //     await connectToMongoDB();
    //     const existingUser = await mongoose.models.User.findById(user._id);
    //     if (!existingUser?.emailVerified) return false;
    //   }
    //   return true;
    // },
    linkAccount: async ({ user }) => {
      await connectToMongoDB();
      await mongoose.models.User.findOneAndUpdate(
        { email: user.email },
        { $set: { emailVerified: new Date() } }
      );
    },
  },
};

export default authConfig;
