const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status !== 200) {
    const { status, error } = validateAuthRes;
    console.log(`[CREATE-MEMBER] ERROR ${status} ${error}`);
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
  const { _id: userId, email } = validateAuthRes.userData;
  console.log(`[CREATE-MEMBER] USER ${email} (${userId}) validated.`);

  try {
    const { teamId, editingData } = JSON.parse(event.body);
    console.log(
      `[CREATE-MEMBER] USER ${email} (${userId}) editing TEAM ${teamId}.`
    );
    const team = await Team.findById(teamId);
    if (!team) {
      console.log(`[CREATE-MEMBER] TEAM ${teamId} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Team not found.",
        }),
      };
    }

    // Only admin can create a member.
    const editor = team.members.find((member) => member.info.userId == userId.toString());
    const isAdmin = editor && editor.info.admin;
    if (!isAdmin) {
      console.log(
        `[CREATE-MEMBER] USER ${email} (${userId}) not authorized to edit TEAM ${teamId}.`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: 403,
          error: "Not authorized to edit this team.",
        }),
      };
    }

    const newMember = {
      info: {
        admin: editingData.info.admin,
        email: editingData.info.email,
      },
      name: editingData.name,
      number: editingData.number,
      role: editingData.role,
      stats: {},
    };
    team.members.push(newMember);
    await team.save();

    console.log(
      `[CREATE-MEMBER] USER ${email} (${userId}) created MEMBER ${newMember._id} in TEAM ${teamId}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        teamData: team,
      }),
    };
  } catch (error) {
    console.log(`[CREATE-MEMBER] ERROR ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        error: error.message,
      }),
    };
  }
};
