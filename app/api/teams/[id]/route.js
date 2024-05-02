import { NextResponse } from "next/server";
import verifyJwt from "../../utils/verify-jwt";
import signJwt from "../../utils/sign-jwt";
import hidePassword from "../../utils/hide-password";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const GET = async (req, { params }) => {
  try {
    const { id: teamId } = params;
    const query = req.nextUrl.searchParams;

    const teamData = await Team.findById(teamId);
    if (!teamData) {
      console.log("[get-teams] Team not found");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    const membersData = await Member.find({ team_id: teamId });

    if (query.get("switch") === "true") {
      const { userData } = await verifyJwt();
      const matchedTeamId = userData.teams.joined.find(
        (id) => id.toString() === teamId
      );
      if (!matchedTeamId) {
        console.log("[get-teams] User is not a member of this team");
        return NextResponse.json(
          { error: "You are not a member of this team" },
          { status: 403 }
        );
      }

      const user = await User.findById(userData._id);
      const teamIndex = user.teams.joined.findIndex(
        (id) => id.toString() === teamId
      );
      user.teams.joined.unshift(user.teams.joined.splice(teamIndex, 1)[0]);
      await user.save();

      const token = await signJwt(user);
      const hidePasswordUser = hidePassword(user);

      const response = NextResponse.json({
        userData: hidePasswordUser,
        teamData,
        membersData,
      });
      response.cookies.set({
        name: "token",
        value: token,
        options: {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
        },
      });
      return response;
    }

    return NextResponse.json({ teamData, membersData }, { status: 200 });
  } catch (error) {
    console.log("[get-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const { userData, token } = await verifyJwt(req);

    const { id: teamId } = params;
    const { name, nickname } = await req.json();
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    const members = await Member.find({ team_id: teamId });
    const isAdmin = members.find(
      (member) => member.meta.user_id.toString() === userData._id.toString()
    )?.meta.admin;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to update this team" },
        { status: 401 }
      );
    }

    if (name) team.name = name;
    if (nickname) team.nickname = nickname;

    await team.save();

    const response = NextResponse.json(
      {
        teamData: team,
      },
      { status: 200 }
    );
    response.cookies.set({
      name: "token",
      value: token,
      options: {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      },
    });
    return response;
  } catch (error) {
    console.log("[update-team]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
