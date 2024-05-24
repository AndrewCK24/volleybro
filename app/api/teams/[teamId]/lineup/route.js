import { NextResponse } from "next/server";
import verifyJwt from "@/app/api/utils/verify-jwt";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const PATCH = async (req, { params }) => {
  try {
    const { teamId } = params;
    const { userData, token } = await verifyJwt(req);
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

    const lineup = await req.json();
    team.lineup = lineup;

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
    console.log("[patch-team-lineup]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
