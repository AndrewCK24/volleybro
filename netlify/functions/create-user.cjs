const bcrypt = require("bcryptjs");
const User = require("./models/user.cjs");
const Team = require("./models/team.cjs");
const connectMongoDB = require("./utils/connect-mongodb.cjs");
const jwtSignIn = require("./utils/jwt-sign-in.cjs");
const userResData = require("./utils/user-res-data.cjs");

exports.handler = async (event) => {
  try {
    await connectMongoDB.handler();
    const { email, password, name } = JSON.parse(event.body);
    console.log(`[AUTH] USER ${email} trying to sign up...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      teamIds: [],
    });
    await user.save();
    console.log(`[AUTH] USER ${email} created.`);
    const token = jwtSignIn.handler(user);
    const resData = userResData.handler(user);
    return {
      statusCode: 201,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Max-Age=${30 * 24 * 60 * 60}`,
      },
      body: JSON.stringify({
        status: 201,
        message: "sign-up succeed",
        userData: resData,
      }),
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: error.message }),
    };
  }
};