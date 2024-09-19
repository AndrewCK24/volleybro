import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/infrastructure/mongoose/connect-to-mongodb";
import User from "@/infrastructure/mongoose/schemas/user";

export const dynamic = "force-dynamic";

export const GET = async () => {
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

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
