const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const connectMongoDB = require("./connect-mongodb.cjs");
const signJWT = require("./sign-jwt.cjs");
const userResData = require("./user-res-data.cjs");
const User = require("../models/user.cjs");

exports.handler = async (event) => {
  console.log("[AUTH] validate-auth started");
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    console.log("[AUTH] token not found");
    return {
      status: 401,
      error: "Token not found",
    };
  }

  try {
    const cookie = jwt.verify(token, JWT_SECRET_KEY);
    const cookieUser = cookie._doc;
    console.log(`[AUTH] token verified for USER ${cookieUser.email} (${cookieUser._id})`);

    await connectMongoDB.handler();
    const dbUser = await User.findById(cookieUser._id);
    console.log(`[AUTH] dbUser found for USER ${cookieUser.email} (${cookieUser._id})`);
    if (cookieUser.password === dbUser.password) {
      console.log(`[AUTH] passwords match for USER ${cookieUser.email} (${cookieUser._id})`);
      const newToken = signJWT.handler(dbUser);
      const userData = userResData.handler(dbUser);
      return {
        status: 200,
        userData,
        newToken,
      };
    } else {
      console.log(`[AUTH] passwords do not match for USER ${cookieUser.email} (${cookieUser._id})`);
      return {
        status: 400,
        error: "Token validation failed",
      };
    }
  } catch (err) {
    console.log(`[AUTH] token validation failed`);
    return {
      status: 400,
      error: "Token validation failed",
    };
  }
};
