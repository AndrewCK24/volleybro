import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import connectMongoDB from "../../utils/connect-mongodb";
import hidePassword from "../../utils/hide-password";
import signJwt from "../../utils/sign-jwt";
import verifyJwt from "../../utils/verify-jwt";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

// for route testing
export const GET = async (req) => {
  const data = await verifyJwt();
  if (data.error) {
    console.log("[sign-in] verifyJwt error:", data);
    console.log("[sign-in] verifyJwt error:", data.error);
    const response = NextResponse.json({ error: data.error }, { status: 500 });
    response.cookies.set({
      name: "token",
      value: "",
      options: {
        httpOnly: true,
        maxAge: 0,
      },
    });
    return response;
  }

  const { userData, token } = data;
  const defaultTeamId = userData.teams.joined[0];
  const teamData = await Team.findById(defaultTeamId);
  const membersData = await Member.find({ team_id: defaultTeamId });
  const response = NextResponse.json(
    { userData, teamData, membersData },
    { status: 200 }
  );
  response.cookies.set({
    name: "token",
    value: token,
    options: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  });
  return response;
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

    const token = await signJwt(user);
    const userData = hidePassword(user);
    const defaultTeamId = userData.teams.joined[0];
    const teamData = await Team.findById(defaultTeamId);
    // if (!team) { ... }
    // TODO: 思考是否要做刪除隊伍功能 (this happens when team was deleted)

    const membersData = await Member.find({ team_id: defaultTeamId });

    const response = NextResponse.json(
      { userData, teamData, membersData },
      { status: 200 }
    );
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
