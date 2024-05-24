import { NextResponse } from "next/server";
import verifyJwt from "../../utils/verify-jwt";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const GET = async (req, { params }) => {
  try {
    const { teamId } = params;
    const query = req.nextUrl.searchParams;
    await connectToMongoDB();

    const team = await Team.findById(teamId);
    if (!team) {
      console.log("[get-teams] Team not found");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
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
