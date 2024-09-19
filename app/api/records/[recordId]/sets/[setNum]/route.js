import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/infrastructure/mongoose/connect-to-mongodb";
import User from "@/infrastructure/mongoose/schemas/user";
import Record from "@/infrastructure/mongoose/schemas/record";

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

    const { recordId, setNum } = params;

    const record = await Record.findById(recordId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    const set = record.sets[setNum];
    if (!set) {
      return NextResponse.json({ error: "Set not found" }, { status: 404 });
    }

    const setData = await req.json();
    const { lineup, options } = setData;
    record.sets[setNum] = {
      ...set,
      lineups: { home: lineup },
      options,
    };
    await record.save();

    return NextResponse.json(record.sets[setNum], { status: 200 });
  } catch (error) {
    console.log("[PUT /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
