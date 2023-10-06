const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");
const User = require("./models/user.cjs");

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
    const { teamId, editingData, editingMember } = JSON.parse(event.body);
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

    // Only admin or member himself/herself can update a member.
    const editor = team.members.find(
      (member) => member.info.userId == userId.toString()
    );
    const isAuthorized = editor.info.admin || editor._id.toString() === editingMember;
    if (!isAuthorized) {
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
    const memberIndex = team.members.findIndex(
      (member) => member._id.toString() === editingMember
    );
    if (memberIndex === -1) {
      console.log(`[UPDATE-MEMBER] MEMBER ${editingMember} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Member not found.",
        }),
      };
    }

    // Handle team invitation.
    if (editingData.info.email !== team.members[memberIndex].info.email) {
      const duplicateMember = editingData.info.email && team.members.find(
        (member) => member.info.email === editingData.info.email
      );
      if (duplicateMember) {
        console.log(
          `[UPDATE-MEMBER] already invited this USER ${editingData.info.email} with other member.`
        );
        return {
          statusCode: 409,
          body: JSON.stringify({
            status: 409,
            error: "User already invited.",
          }),
        };
      }

      if (team.members[memberIndex].info.userId) {
        const originalMember = await User.findById(
          team.members[memberIndex].info.userId
        );
        originalMember.teams = originalMember.teams.filter(
          (originalTeam) => originalTeam._id.toString() !== team._id.toString()
        );
        delete team.members[memberIndex].info.userId;
        await originalMember.save();
      } else if (team.members[memberIndex].info.email) {
        const originalMember = await User.findOne({
          email: team.members[memberIndex].info.email,
        });
        originalMember.invitingTeams = originalMember.invitingTeams.filter(
          (originalInvitingTeam) =>
            originalInvitingTeam._id.toString() !== team._id.toString()
        );
        await originalMember.save();
      }

      if (editingData.info.email) {
        const invitedMember = await User.findOne({
          email: editingData.info.email,
        });
        if (invitedMember) {
          invitedMember.invitingTeams.push({
            _id: team._id,
            name: team.name,
          });
          await invitedMember.save();
        }
      }
    }

    // Update the member.
    team.members[memberIndex] = {
      ...team.members[memberIndex],
      info: {
        ...team.members[memberIndex].info,
        admin: editingData.info.admin,
        email: editingData.info.email,
        // TODO: 之後新增自動同意邀請功能
      },
      name: editingData.name,
      number: editingData.number,
      role: editingData.role,
    };
    await team.save();

    console.log(
      `[UPDATE-MEMBER] USER ${email} (${userId}) updated MEMBER ${editingMember} in TEAM ${teamId}.`
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
