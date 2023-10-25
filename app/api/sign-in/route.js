import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import connectMongoDB from "../utils/connect-mongodb";
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
  const { email, password } = req.body;
  const response = NextResponse;
  try {
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[sign-in] user (${email}) not found!`);
      return response.json({ error: "User not found" }, { status: 404 });
    }
    console.log(`[sign-in] user (${email}) found!`);

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log(`[sign-in] user (${email}) password is incorrect`);
      response.json({ error: "Incorrect password" }, { status: 401 });
      return response;
    }
    console.log(`[sign-in] user (${email}) password is correct`);

    const defaultTeamId = user.teams.joined[0];
    if (!defaultTeamId) {
      console.log(
        `[sign-in] user (${email}) has no team, turning to team create page`
      );
      return response.json({ user }, { status: 200 });
    }
    console.log(
      `[sign-in] user (${email}) has default team, finding team (${defaultTeamId})`
    );

    const team = await Team.findById(defaultTeamId);
    if (!team) {
      console.log(
        `[sign-in] default team (${defaultTeamId}) of user (${email}) does not exist`
      );
      return response.json({ user }, { status: 200 });
    }

    return response.json({ user, team }, { status: 200 });
  } catch (error) {
    console.log(error);
    return response.json({ error }, { status: 500 });
  }
};
