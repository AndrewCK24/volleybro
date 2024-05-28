import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const GET = async (req, { params }) => {
  try {
    const { teamId } = params;
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
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[PATCH /api/users/teams] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: teamId } = params;
    const { name, nickname } = await req.json();
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: teamId });
    const isAdmin = members.find(
      (member) => member.meta.user_id.toString() === user._id.toString()
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

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.log("[update-team]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
