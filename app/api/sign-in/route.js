import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import connectMongoDB from "../utils/connect-mongodb";
import signJwt from "../utils/sign-jwt";
import User from "@/app/models/user";
import Team from "@/app/models/team";

// for route testing
export const GET = async () => {
  const response = NextResponse;
  await connectMongoDB();
  cookies().set("hello", "world", { httpOnly: true });
  return response.json({ message: "Hello World" });
};

export const POST = async (req) => {
  const { email, password } = await req.json();
  try {
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[sign-in] user (${email}) not found!`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log(`[sign-in] user (${email}) password is incorrect`);
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = signJwt(user);
    const defaultTeamId = user.teams.joined[0];
    const team = await Team.findById(defaultTeamId);
    // if (!team) { ... }
    // TODO: 思考是否要做刪除隊伍功能 (this happens when team was deleted)

    const response = NextResponse.json({ user, team }, { status: 200 });
    response.cookies.set({
      name: "token",
      value: token,
      options: {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      },
    });
    return response;
  } catch (error) {
    console.log("[sign-in]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
