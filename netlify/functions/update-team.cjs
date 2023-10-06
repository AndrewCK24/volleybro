const connectMongoDB = require("./utils/connect-mongodb.cjs");
const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");

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
  console.log(`[UPDATE-TEAM] USER ${email} (${userId}) validated.`);

  try {
    // update team object
    await connectMongoDB.handler();
    const { _id: teamId, name, nickname, members } = JSON.parse(event.body);
    const updatingTeam = await Team.findById(teamId);
    console.log(
      `[UPDATE-TEAM] USER ${email} (${userId}) updating TEAM ${teamId}.`
    );

    // check if user is an admin of the team
    const isAdmin = updatingTeam.members.filter(
      (member) => member.info.userId === userId && member.info.admin
    );
    if (!isAdmin) {
      console.log(
        `[UPDATE-TEAM] USER ${email} (${userId}) not authorized to edit TEAM ${teamId}.`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: 403,
          error: "Not authorized to edit this team.",
        }),
      };
    }

    // update team
    updatingTeam.name = name;
    updatingTeam.nickname = nickname;
    updatingTeam.members = members;
    await updatingTeam.save();

    console.log(
      `[UPDATE-TEAM] USER ${email} (${userId}) updated TEAM ${teamId}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        teamData: updatingTeam,
      }),
    };
  } catch (error) {
    console.log(`[UPDATE-TEAM] ERROR ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        error: error.message,
      }),
    };
  }
};
