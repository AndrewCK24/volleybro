import User from "@/app/models/user";
import Session from "@/app/models/session";
import VerificationToken from "@/app/models/verification-token";
import Account from "@/app/models/account";

export const MongooseAdapter = (connectToMongoDB) => {
  const adaptorMethods = {
    // These methods are required for all sign in flows:
    async createUser(data) {
      console.log("createUser: ", data);
      await connectToMongoDB();
      const user = await User.create(data);
      return user;
    },

    async getUser(id) {
      console.log("getUser: ", id);
      await connectToMongoDB();
      const user = await User.findById(id);
      console.log("getUser user: ", user);
      return user;
    },

    async getUserByEmail(email) {
      console.log("getUserByEmail: ", email);

      await connectToMongoDB();
      const user = await User.findOne({ email });
      return user;
    },
    async getUserByAccount(data) {
      console.log("getUserByAccount: ", data);
      const { providerAccountId, provider } = data;
      await connectToMongoDB();

      // Get Account
      const account = await Account.findOne({ providerAccountId, provider });
      if (!account) return null;

      // Find User
      const user = await adaptorMethods.getUser(account.userId);
      return user;
    },
    async updateUser(data) {
      console.log("updateUser: ", data);
      const { id, ...restData } = data;
      await connectToMongoDB();
      const user = await User.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
        returnDocument: "after",
      });

      return user;
    },
    async deleteUser(userId) {
      console.log("deleteUser: ", userId);

      await connectToMongoDB();
      const user = await User.findByIdAndDelete(userId);
      return user;
    },
    async linkAccount(data) {
      console.log("linkAccount: ", data);

      await connectToMongoDB();
      const account = await Account.create(data);
      return account;
    },
    async unlinkAccount(data) {
      console.log("unlinkAccount: ", data);
      const { providerAccountId, provider } = data;
      await connectToMongoDB();
      const account = await Account.findOneAndDelete({
        providerAccountId,
        provider,
      });

      if (account) return account;
    },
    async createSession(data) {
      console.log("createSession: ", data);

      await connectToMongoDB();
      const session = await Session.create(data);
      return session;
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser: ", sessionToken);
      await connectToMongoDB();

      // Get Session
      const session = await Session.findOne({ sessionToken });
      if (!session) return null;

      // Find User
      const user = await adaptorMethods.getUser(session.userId);
      if (!user) return null;

      return { user, session };
    },
    async updateSession(data) {
      console.log("updateSession: ", data);
      const { id, ...restData } = data;
      await connectToMongoDB();
      const session = await Session.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
      });
      return session;
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession: ", sessionToken);
      await connectToMongoDB();
      const session = await Session.findOneAndDelete({ sessionToken });
      return session;
    },
    // These methods are required to support email / passwordless sign in:
    async createVerificationToken(data) {
      console.log("createVerificationToken: ", data);

      await connectToMongoDB();
      const verificationToken = await VerificationToken.create(data);
      return verificationToken;
    },
    async useVerificationToken(data) {
      console.log("useVerificationToken: ", data);
      const { identifier, token } = data;
      await connectToMongoDB();
      const verificationToken = await VerificationToken.findOne({
        identifier,
        token,
      });
      return verificationToken;
    },
    // ################################################################################
    // These methods will be required in a future release, but are not yet invoked:
    // async deleteUser() {
    //   return;
    // },
    // async unlinkAccount() {
    //   return;
    // },
  };

  return adaptorMethods;
};

export default MongooseAdapter;
