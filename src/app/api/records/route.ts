import { NextRequest, NextResponse } from "next/server";
import { createRecordController } from "@/interface/controllers/record/create-record.controller";
import { auth } from "@/auth";
import connectToMongoDB from "@/infrastructure/mongoose/connect-to-mongodb";
import User from "@/infrastructure/mongoose/schemas/user";
import Record from "@/infrastructure/mongoose/schemas/record";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById((session.user as { _id: string })._id);
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

export const POST = async (req: NextRequest) => {
  try {
    const request = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("ti");

    const input = {
      params: { teamId },
      data: {
        info: request.info,
        team: request.team,
        lineup: request.lineup,
      },
    };

    const record = await createRecordController(input);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.log("[CREATE RECORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
