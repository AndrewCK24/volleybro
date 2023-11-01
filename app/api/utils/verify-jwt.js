import { verify } from "jsonwebtoken";
import connectMongoDB from "./connect-mongodb";
import signJwt from "./sign-jwt";
import hidePassword from "./hide-password";
import User from "@/app/models/user";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJwt = async (req) => {
  const { cookies } = req;
  const token = cookies.get("token").value;
  if (!token) {
    console.log("[verify-jwt] token not found!");
    return { error: "Token not found" };
  }

  try {
    const userData = verify(token, JWT_SECRET);

    await connectMongoDB();
    const user = await User.findById(userData._id);
    if (!user) {
      console.log("[verify-jwt] user not found!");
      return { error: "User not found" };
    }

    if (user.password !== userData.password) {
      console.log("[verify-jwt] user password is incorrect!");
      return { error: "Incorrect password" };
    }

    const newToken = signJwt(user);
    return { userData: hidePassword(user), token: newToken };
  } catch (error) {
    console.log("[verify-jwt]", error);
    return { error };
  }
};

export default verifyJwt;
