import { NextResponse } from "next/server";
import connectMongoDB from "@/app/api/utils/connect-mongodb";
import Member from "@/app/models/member";

export const GET = async (req, { params }) => {
  try {
    const { id: teamId } = params;
    await connectMongoDB();
    const members = await Member.find({ team_id: teamId });
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.log("[get-team-members]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
