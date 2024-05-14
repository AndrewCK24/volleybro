import mongoose from "mongoose";
import { compareSync } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import connectToMongoDB from "@/lib/connect-to-mongodb";

const authConfig = {
  providers: [
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
  pages: {
    signIn: "/",
    newUser: "/team/invitations",
  },
};

export default authConfig;
