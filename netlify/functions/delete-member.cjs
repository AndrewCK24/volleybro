const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");
const User = require("./models/user.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status !== 200) {
    const { status, error } = validateAuthRes;
    console.log(`[DELETE-MEMBER] ERROR ${status} ${error}`);
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
  const { _id: userId, email } = validateAuthRes.userData;
  console.log(`[DELETE-MEMBER] USER ${email} (${userId}) validated.`);

  try {
    const { teamId, editingMember } = JSON.parse(event.body);
    console.log(
      `[DELETE-MEMBER] USER ${email} (${userId}) editing TEAM ${teamId}.`
    );
    const team = await Team.findById(teamId);
    if (!team) {
      console.log(`[DELETE-MEMBER] TEAM ${teamId} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Team not found.",
        }),
      };
    }

    // Only admin can delete a member.
    const editor = team.members.find(
      (member) => member.info.userId == userId.toString()
    );
    const isAdmin = editor && editor.info.admin;
    if (!isAdmin) {
      console.log(
        `[DELETE-MEMBER] USER ${email} (${userId}) not authorized to edit TEAM ${teamId}.`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: 403,
          error: "Not authorized to edit this team.",
        }),
      };
    }

    // Find the member to delete.
    const memberIndex = team.members.findIndex(
      (member) => member._id.toString() === editingMember
    );
    if (memberIndex === -1) {
      console.log(`[DELETE-MEMBER] MEMBER ${editingMember} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Member not found.",
        }),
      };
    }

    // Handle team invitation.
    const member = team.members[memberIndex];
    if (member.info.userId) {
      const originalMember = await User.findById(member.info.userId);
      originalMember.teams = originalMember.teams.filter(
        (team) => team._id.toString() !== teamId.toString()
      );
      await originalMember.save();
    } else if (member.info.email) {
      const invitedMember = await User.findOne({ email: member.info.email });
      invitedMember.invitingTeams = invitedMember.invitingTeams.filter(
        (invitingTeam) => invitingTeam._id.toString() !== teamId.toString()
      );
      await invitedMember.save();
    }

    // Delete the member.
    team.members.splice(memberIndex, 1);
    await team.save();

    console.log(`[DELETE-MEMBER] MEMBER ${editingMember} deleted.`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        teamData: team,
        message: "Member deleted.",
      }),
    };
  } catch (error) {
    console.log(`[DELETE-MEMBER] ERROR ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        error: "Server error.",
      }),
    };
  }
};
