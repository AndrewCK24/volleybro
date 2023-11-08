import { NextResponse } from "next/server";
import verifyJwt from "../utils/verify-jwt";
import signJwt from "../utils/sign-jwt";
import hidePassword from "../utils/hide-password";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const GET = async () => {
  const { userData, token } = await verifyJwt();
  const { joined } = userData.teams;
  const teams = await Team.find({ _id: { $in: joined } });

  return NextResponse.json({ teams }, { status: 200 });
};

export const POST = async (req) => {
  try {
    const { userData } = await verifyJwt(req);
    const newMember = new Member({
      name: userData.name,
      meta: {
        admin: true,
        email: userData.email,
        user_id: userData._id,
      },
    });

    const { name, nickname } = await req.json();
    // TODO: Add validation for name and nickname
    // if there is a team with the same name, ask the user to choose another name or join the existing team
    const newTeam = new Team({
      name,
      nickname,
      members: [newMember._id],
    });

    const updatedUser = await User.findById(userData._id);
    newMember.team_id = newTeam._id;
    updatedUser.teams.joined.push(newTeam._id);

    await newMember.save();
    await newTeam.save();
    await updatedUser.save();

    const token = await signJwt(updatedUser);
    const user = hidePassword(updatedUser);
    const response = NextResponse.json(
      { userData: user, teamData: newTeam, membersData: [newMember] },
      { status: 201 }
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
    console.log("[create-team]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
