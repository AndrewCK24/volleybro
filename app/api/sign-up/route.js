import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
import { hash } from "bcryptjs";
import connectMongoDB from "../utils/connect-mongodb";
import User from "@/app/models/user";
// import Team from "@/app/models/team";

export const POST = async (req) => {
  const response = NextResponse;
  const { email, password, confirm_password, name } = await req.json();

  try {
    await connectMongoDB();
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      console.log(`[sign-up] user (${email}) already exists!`);
      return response.json({ error: "User already exists" }, { status: 409 });
    }

    if (password !== confirm_password) {
      console.log(password, confirm_password);
      console.log(`[sign-up] password and confirm_password are not matched!`);
      return response.json(
        { error: "Password and confirm password are not matched" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);

    // TODO: add fetching inviting team functions (by Member)
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    await user.save();
    console.log(`[sign-up] user (${email}) created!`);

    // TODO: add JWT cookies
    return response.json({ user }, { status: 201 });
  } catch (error) {
    console.log(error);
    return response.json({ error }, { status: 500 });
  }
};
