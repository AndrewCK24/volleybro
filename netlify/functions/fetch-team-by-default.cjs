const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");

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
    const teamId = validateAuthRes.userData.teamIds[0];
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        teamData: team,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
