import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Record from "@/app/models/record";

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
      sets: [{ lineup: recordData.lineup }],
    });
    console.log("[CREATE RECORD] New record", newRecord);
    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.log("[CREATE RECORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
