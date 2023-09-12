const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status !== 200) {
    const { status, error } = validateAuthRes;
    console.log(`[UPDATE-MEMBER] ERROR ${status} ${error}`);
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
  const { _id: userId, email } = validateAuthRes.userData;
  console.log(`[UPDATE-MEMBER] USER ${email} (${userId}) validated.`);

  try {
    const { teamId, editingData, memberData } = JSON.parse(event.body);
    console.log(
      `[UPDATE-MEMBER] USER ${email} (${userId}) editing TEAM ${teamId}.`
    );
    const team = await Team.findById(teamId);
    if (!team) {
      console.log(`[UPDATE-MEMBER] TEAM ${teamId} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Team not found.",
        }),
      };
    }

    // Only admin can update a member.
    const editor = team.members.find((member) => member.info.userId == userId.toString());
    const isAdmin = editor && editor.info.admin;
    if (!isAdmin) {
      console.log(
        `[UPDATE-MEMBER] USER ${email} (${userId}) not authorized to edit TEAM ${teamId}.`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: 403,
          error: "Not authorized to edit this team.",
        }),
      };
    }

    // Find the member to update.
    console.log(`[UPDATE-MEMBER] memberData: ${JSON.stringify(memberData._id)}`);
    console.log(`[UPDATE-MEMBER] team.members: ${JSON.stringify(team.members)}`);
    const memberIndex = team.members.findIndex(
      (member) => member._id.toString() === memberData._id
    );
    if (memberIndex === -1) {
      console.log(`[UPDATE-MEMBER] MEMBER ${memberData._id} not found.`);
      return { 
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Member not found.",
        }),
      };
    }

    // Update the member.
    team.members[memberIndex] = {
      ...team.members[memberIndex],
      info: {
        ...team.members[memberIndex].info,
        admin: editingData.info.admin,
        email: editingData.info.email,
      },
      name: editingData.name,
      number: editingData.number,
      role: editingData.role,
    };
    await team.save();

    console.log(
      `[UPDATE-MEMBER] USER ${email} (${userId}) updated MEMBER ${memberData._id} in TEAM ${teamId}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        teamData: team,
      }),
    };
  } catch (error) {
    console.log(`[UPDATE-MEMBER] ERROR ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        error: error.message,
      }),
    };
  }
};
