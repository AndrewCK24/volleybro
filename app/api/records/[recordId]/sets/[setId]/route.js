import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Record from "@/app/models/record";

export const PUT = async (req, { params }) => {
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

    const { recordId, setId } = params;

    const record = await Record.findById(recordId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    const set = record.sets[setId];
    if (!set) {
      return NextResponse.json({ error: "Set not found" }, { status: 404 });
    }

    const { lineup, options } = req.body;
    record.sets[setId] = {
      ...set,
      lineups: { home: lineup },
      options,
    };
    await record.save();

    return NextResponse.json(record.sets[setId], { status: 200 });
  } catch (error) {
    console.log("[PUT /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
