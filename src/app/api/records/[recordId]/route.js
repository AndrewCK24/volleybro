import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/src/infrastructure/mongoose/connect-to-mongodb";
import User from "@/src/infrastructure/mongoose/schemas/user";
import Record from "@/src/infrastructure/mongoose/schemas/record";

export const GET = async (req, { params }) => {
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

    const { recordId } = params;

    const record = await Record.findById(recordId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.log("[GET /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
