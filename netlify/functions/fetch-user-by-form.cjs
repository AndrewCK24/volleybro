const bcrypt = require("bcryptjs");
const User = require("./models/user.cjs");
const Team = require("./models/team.cjs");
const connectMongoDB = require("./utils/connect-mongodb.cjs");
const jwtSignIn = require("./utils/jwt-sign-in.cjs");
const userResData = require("./utils/user-res-data.cjs");

exports.handler = async (event) => {
  try {
    await connectMongoDB.handler();
    const { email, password } = JSON.parse(event.body);
    console.log(`[AUTH] USER ${email} trying to sign in...`);
    const user = await User.findOne({ email });
    if (user) {
      console.log(`[AUTH] USER ${email} found.`);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        console.log(`[AUTH] USER ${email} (${user._id}) signed in.`);
        console.log("user", user.teams[0]._id);
        const token = jwtSignIn.handler(user);
        const resData = userResData.handler(user);
        const defaultTeamId = user.teams[0]._id;
        console.log(`[AUTH] USER ${email} default team: ${defaultTeamId}`);
        if (defaultTeamId) {
          const team = await Team.findById(defaultTeamId);
          return {
            statusCode: 200,
            headers: {
              "Set-Cookie": `token=${token}; HttpOnly; Secure; Max-Age=${
                30 * 24 * 60 * 60
              }`,
            },
            body: JSON.stringify({
              status: 200,
              message: "sign-in succeed",
              userData: resData,
              teamData: team,
            }),
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
              message: "start creating team",
              userData: resData,
            }),
          };
        }
      } else {
        console.log(`[AUTH] USER ${email} wrong password.`);
        return {
          statusCode: 401,
          body: JSON.stringify({ status: 401, error: "wrong password" }),
        };
      }
    } else {
      console.log(`[AUTH] USER ${email} not found, turning to sign-up page...`);
      return {
        statusCode: 210,
        body: JSON.stringify({ status: 210, message: "sign-up started" }),
      };
    }
  } catch (error) {
    console.log(`[AUTH] ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
