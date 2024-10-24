import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/infrastructure/mongoose/connect-to-mongodb";
import User from "@/infrastructure/mongoose/schemas/user";
import Record from "@/infrastructure/mongoose/schemas/record";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById((session.user as { _id: string })._id);
    if (!user) {
      console.error("[PATCH /api/users/teams] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

// TODO: 新增上場選手對應局數的 stats 物件（在開新局、換人時）
