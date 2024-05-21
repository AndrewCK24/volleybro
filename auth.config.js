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
};

export default authConfig;
