import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
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

export const PATCH = async (req) => {
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

    const { teamId, accept } = await req.json();

    const team = await Team.findById(teamId);
    if (!team) {
      console.error("[PATCH /api/users/teams] Team not found");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const member = await Member.findOne({
      team_id: teamId,
      "meta.email": user.email,
    });
    if (!member) {
      console.error("[PATCH /api/users/teams] Member not found");
      return NextResponse.json(
        { error: "You are not invited to this team" },
        { status: 403 }
      );
    }

    const isInvited = user.teams.inviting.find((id) => id.equals(teamId));
    if (!isInvited) {
      console.error("[PATCH /api/users/teams] User is not invited");
      return NextResponse.json(
        { error: "You are not invited to this team" },
        { status: 403 }
      );
    }

    if (accept) {
      user.teams.joined.push(teamId);
      user.teams.inviting = user.teams.inviting.filter(
        (id) => !id.equals(teamId)
      );
      member.meta.user_id = user._id;
    } else {
      user.teams.inviting = user.teams.inviting.filter(
        (id) => !id.equals(teamId)
      );
      member.meta.email = null;
    }

    await user.save();
    await member.save();

    return NextResponse.json(user.teams, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
