const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const connectMongoDB = require("./utils/connect-mongodb.cjs");
const signJWT = require("./utils/sign-jwt.cjs");
const userResData = require("./utils/user-res-data.cjs");
const User = require("./models/user.cjs");

exports.handler = async (event) => {
  console.log("validate-jwt started");
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ status: 401, error: "Token not found" }),
    };
  }
  console.log("token found");

  try {
    const cookie = jwt.verify(token, JWT_SECRET_KEY);
    const cookieUser = cookie._doc;
    console.log("cookieUser", cookieUser);
    await connectMongoDB.handler();

    const dbUser = await User.findById(cookieUser._id);
    console.log("dbUser", dbUser);
    if (cookieUser.password === dbUser.password) {
      console.log("passwords match");
      const newToken = signJWT.handler(dbUser);
      const userData = userResData.handler(dbUser);
      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": `token=${newToken}; HttpOnly; Max-Age=${
            30 * 24 * 60 * 60
          }`,
        },
        body: JSON.stringify({
          status: 200,
          userData,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 400, error: "Token validation failed" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: 400, error: "Token validation failed" }),
    };
  }
};
