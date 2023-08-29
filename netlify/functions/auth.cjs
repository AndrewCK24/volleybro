const connectMongoDB = require("./utils/connect-mongodb.cjs");
const signJWT = require("./utils/sign-jwt.cjs");
const bcrypt = require("bcryptjs");
const User = require("./models/user.cjs");

exports.handler = async (event) => {
  try {
    await connectMongoDB.handler();
    const { email, password } = JSON.parse(event.body);
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = signJWT.handler(user._id, user.teams);
        if (user.teams.length) {
          return {
            statusCode: 200,
            headers: {
              "Set-Cookie": `token=${token}; HttpOnly; Max-Age=${
                30 * 24 * 60 * 60
              }`,
            },
            body: JSON.stringify({ status: 200, message: "sign-in succeed" }),
          };
        } else {
          return {
            statusCode: 201,
            headers: {
              "Set-Cookie": `token=${token}; HttpOnly; Max-Age=${
                30 * 24 * 60 * 60
              }`,
            },
            body: JSON.stringify({
              status: 201,
              message: "sign-up not completed",
            }),
          };
        }
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ status: 401, error: "wrong password" }),
        };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return {
      statusCode: 201,
      body: JSON.stringify({ status: 201, message: "sign-up started" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
