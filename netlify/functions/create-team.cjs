const connectMongoDB = require("./utils/connect-mongodb.cjs");
const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");
const User = require("./models/user.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status !== 200) {
    const { status, error } = validateAuthRes;
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
  const { _id: userId, email } = validateAuthRes.userData;
  console.log(`[CREATE-TEAM] USER ${email} (${userId}) validated.`);

  try {
    // create new team object
    await connectMongoDB.handler();
    const { name } = JSON.parse(event.body);
    const newTeam = new Team({ name });

    // add user as an admin(member) to team
    const newMember = {
      info: {
        email,
        admin: true,
        userId,
      },
    };
    newTeam.members.push(newMember);
    await newTeam.save();

    // add teamId to user
    const { _id: teamId } = newTeam;
    const user = await User.findById(userId);
    user.teamIds.push(teamId);
    await user.save();
    console.log(`[CREATE-TEAM] USER ${email} (${userId}) created TEAM ${name}(${teamId}).`);

    const { status, newToken } = validateAuthRes;
    return {
      statusCode: status,
      headers: {
        "Set-Cookie": `token=${newToken}; HttpOnly; Max-Age=${
          30 * 24 * 60 * 60
        }`,
      },
      body: JSON.stringify({
        status,
        userData: user,
        teamData: newTeam,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
