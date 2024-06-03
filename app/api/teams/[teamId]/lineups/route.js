import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const PATCH = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      console.error("[PATCH /api/teams/[teamId]/lineups] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[PATCH /api/teams/[teamId]/lineups] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { teamId } = params;

    const team = await Team.findById(teamId);
    if (!team) {
      console.error("[PATCH /api/teams/[teamId]/lineups] Team not found");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: teamId });
    const isAdmin = members.find(
      (member) => member.meta?.user_id?.toString() === user._id.toString()
    )?.meta.admin;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to update this team" },
        { status: 401 }
      );
    }

    const lineups = await req.json();
    team.lineups = lineups;

    await team.save();

    return NextResponse.json(lineups, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/teams/[teamId]/lineups] Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
