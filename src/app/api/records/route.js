import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/src/infrastructure/mongoose/connect-to-mongodb";
import User from "@/src/infrastructure/mongoose/schemas/user";
import Team from "@/src/infrastructure/mongoose/schemas/team";
import Record from "@/src/infrastructure/mongoose/schemas/record";

export const GET = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[GET /api/records] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    if (!teamId) {
      console.error("[GET /api/records] Team ID is required");
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    const isUserInTeam = user.teams.joined.some((t) => t.toString() === teamId);
    if (!isUserInTeam) {
      console.log(`[GET RECORDS] USER(${user.email}) Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records = await Record.find({ team_id: teamId });
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.log("[GET /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[POST /api/records] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recordData = await req.json();

    const isUserInTeam = user.teams.joined.some(
      (teamId) => teamId.toString() === recordData.team._id
    );
    if (!isUserInTeam) {
      console.log(`[CREATE RECORD] USER(${user.email}) Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(recordData.team._id);
    if (!team) {
      console.log(`[CREATE RECORD] TEAM(${recordData.team_id}) Team not found`);
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const newRecord = new Record({
      team_id: team._id,
      info: recordData.info,
      teams: { home: recordData.team },
      sets: [{ lineups: { home: recordData.lineup } }],
    });
    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.log("[CREATE RECORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
