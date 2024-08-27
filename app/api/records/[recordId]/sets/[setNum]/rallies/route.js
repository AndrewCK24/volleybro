import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Record from "@/app/models/record";

export const POST = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { recordId, setNum } = params;

    const record = await Record.findById(recordId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    const set = record.sets[setNum];
    if (!set) {
      return NextResponse.json({ error: "Set not found" }, { status: 404 });
    }

    // TODO: handle race condition
    const rally = await req.json();
    record.sets[setNum].rallies.push(rally);
    await record.save();

    return NextResponse.json(record.sets[setNum].rallies, { status: 200 });
  } catch (error) {
    console.log("[POST /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
