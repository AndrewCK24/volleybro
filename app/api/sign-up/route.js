import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectMongoDB from "../utils/connect-mongodb";
import hideUserPassword from "../utils/hide-user-password";
import signJwt from "../utils/sign-jwt";
import User from "@/app/models/user";
import Team from "@/app/models/team";

export const POST = async (req) => {
  const { email, password, confirm_password, name } = await req.json();

  try {
    await connectMongoDB();

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      console.log(`[sign-up] user (${email}) already exists!`);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    if (password !== confirm_password) {
      console.log(`[sign-up] password and confirm_password are not matched!`);
      return NextResponse.json(
        { error: "Password and confirm password are not matched" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);

    // TODO: add fetching inviting team functions (by Member)
    const invitingTeams = await Team.find({ "members.email": email });

    const user = new User({
      email,
      password: hashedPassword,
      name,
      teams: {
        joined: [],
        inviting: invitingTeams,
      },
    });
    await user.save();
    console.log(`[sign-up] user (${email}) created!`);

    // TODO: add JWT cookies
    const userData = hideUserPassword(user);
    const token = signJwt(userData);

    const response = NextResponse.json({ userData }, { status: 201 });
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
    console.log("[sign-up]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
