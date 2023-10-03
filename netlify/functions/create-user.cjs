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

    const foundUser = await User.findOne({ email });
    console.log(foundUser);
    if (foundUser) {
      console.log(`[AUTH] USER ${email} already exists.`);
      return {
        statusCode: 409,
        body: JSON.stringify({ status: 409, error: "user already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foundTeams = await Team.find({ "members.info.email": email });
    const invitingTeams = foundTeams.map((team) => ({_id: team._id, name: team.name}));
    const user = new User({
      name,
      email,
      password: hashedPassword,
      teams: [],
      invitingTeams,
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
