const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status === 200) {
    const { status, userData, newToken } = validateAuthRes;
    const defaultTeamId = userData.teamIds[0];
    try {
      let teamData;
      if (defaultTeamId) {
        teamData = await Team.findById(defaultTeamId);
      }

      return {
        statusCode: status,
        headers: {
          "Set-Cookie": `token=${newToken}; HttpOnly; Max-Age=${
            30 * 24 * 60 * 60
          }`,
        },
        body: JSON.stringify({
          status,
          userData,
          teamData,
        }),
      };
    } catch (error) {
      console.log(`[AUTH] default team not found, ${error}`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: 400,
          error: "Default team not found",
        }),
      };
    }
  } else {
    const { status, error } = validateAuthRes;
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
};
