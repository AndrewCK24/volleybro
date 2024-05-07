import { NextResponse } from "next/server";
import verifyJwt from "../../utils/verify-jwt";
import User from "@/app/models/user";
import Team from "@/app/models/team";

export const GET = async (req) => {
  try {
    const { userData } = await verifyJwt(req);

    const user = await User.findById(userData._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { joined, inviting } = user.teams;

    // find joined teams and inviting teams respectively
    const joinedTeams = await Team.find({ _id: { $in: joined } });
    const invitingTeams = await Team.find({ _id: { $in: inviting } });

    const teams = {
      joined: joinedTeams,
      inviting: invitingTeams,
    };

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
