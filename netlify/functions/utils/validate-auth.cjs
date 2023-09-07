const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const connectMongoDB = require("./connect-mongodb.cjs");
const signJWT = require("./sign-jwt.cjs");
const userResData = require("./user-res-data.cjs");
const User = require("../models/user.cjs");

exports.handler = async (event) => {
  console.log("validate-auth started");
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return {
      status: 401,
      error: "Token not found",
    };
  }
  console.log("token found");

  try {
    const cookie = jwt.verify(token, JWT_SECRET_KEY);
    const cookieUser = cookie._doc;
    console.log("cookieUser", cookieUser);

    await connectMongoDB.handler();
    const dbUser = await User.findById(cookieUser._id);
    console.log("dbUser found", dbUser);
    if (cookieUser.password === dbUser.password) {
      console.log("user passwords matched");
      const newToken = signJWT.handler(dbUser);
      const userData = userResData.handler(dbUser);
      return {
        status: 200,
        userData,
        newToken,
      };
    } else {
      return {
        status: 400, 
        error: "Token validation failed",
      };
    }
  } catch (err) {
    return {
      status: 400,
      error: "Token validation failed",
    };
  }
};
