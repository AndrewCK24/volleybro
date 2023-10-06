const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");
const User = require("./models/user.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status !== 200) {
    const { status, error } = validateAuthRes;
    console.log(`[FETCH-TEAM] ERROR ${status} ${error}`);
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
  const { _id: userId, email } = validateAuthRes.userData;
  console.log(`[FETCH-TEAM] USER ${email} (${userId}) validated.`);

  try {
    const { teamId } = JSON.parse(event.body);
    console.log(
      `[FETCH-TEAM] USER ${email} (${userId}) fetching TEAM ${teamId}.`
    );
    const team = await Team.findById(teamId);
    if (!team) {
      console.log(`[FETCH-TEAM] TEAM ${teamId} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Team not found.",
        }),
      };
    }
    console.log(`[FETCH-TEAM] USER ${email} (${userId}) fetched TEAM ${teamId}.`);

    // Set the team as the default team for the user
    const user = await User.findById(userId);
    const teamIndex = user.teams.findIndex((team) => team._id.toString() === teamId);
    user.teams.unshift(user.teams.splice(teamIndex, 1)[0]);
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        userData: user,
        teamData: team,
      }),
    };
  } catch (error) {
    console.log(`[FETCH-TEAM] ERROR ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: error.message }),
    };
  }
}
