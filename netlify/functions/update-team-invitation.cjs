const validateAuth = require("./utils/validate-auth.cjs");
const Team = require("./models/team.cjs");
const User = require("./models/user.cjs");

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
  console.log(`[UPDATE-INVITATION] USER ${email} (${userId}) validated.`);

  try {
    const { teamId, accept } = JSON.parse(event.body);
    const user = await User.findById(userId);

    if (!accept) {
      user.invitingTeams = user.invitingTeams.filter(
        (team) => team._id.toString() !== teamId
      );
      await user.save();
      console.log(
        `[UPDATE-INVITATION] USER ${email} (${userId}) turned down invitation by TEAM ${teamId}.`
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 200,
          userData: user,
          message: "Invitation turned down.",
        }),
      };
    }

    const team = await Team.findById(teamId);
    if (!team) {
      console.log(`[UPDATE-INVITATION] TEAM ${teamId} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          error: "Team not found.",
        }),
      };
    }

    const memberIndex = team.members.findIndex(
      (member) => member.info.email === email
    );
    if (memberIndex === -1) {
      console.log(
        `[UPDATE-INVITATION] MEMBER ${email} not found in TEAM ${teamId}.`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: 403,
          error: "Not invited by this team.",
        }),
      };
    }

    // Handle team invitation.
    team.members[memberIndex].info.userId = userId;
    const acceptedTeamIndex = user.invitingTeams.findIndex(
      (team) => team._id.toString() === teamId
    );
    console.log("acceptedTeamIndex", acceptedTeamIndex);
    const acceptedTeam = user.invitingTeams.splice(acceptedTeamIndex, 1)[0];
    console.log("acceptedTeam", acceptedTeam);
    console.log("user.invitingTeams", user.invitingTeams);
    user.teams.unshift(acceptedTeam);
    console.log("user.teams", user.teams);
    await user.save();
    await team.save();

    console.log(
      `[UPDATE-INVITATION] USER ${email} (${userId}) accepted invitation by TEAM ${teamId}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        userData: user,
        teamData: team,
        message: "Invitation accepted.",
      }),
    };
  } catch (error) {
    console.log(`[UPDATE-INVITATION] ERROR ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
