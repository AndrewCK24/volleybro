import { NextResponse } from "next/server";
import verifyJwt from "../utils/verify-jwt";
import signJwt from "../utils/sign-jwt";
import hidePassword from "../utils/hide-password";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const POST = async (req) => {
  try {
    const { userData, token } = await verifyJwt(req);
    const formData = await req.json();

    // find the team
    const team = await Team.findById(formData.team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: formData.team_id });

    // any member can create members
    const userIsMember = members.find(
      (member) => member.meta.user_id.toString() === userData._id.toString()
    );
    if (!userIsMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // only admins can create admins
    const userIsAdmin = userIsMember.meta.admin;
    if (formData.admin && !userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasSameNumber = members.find(
      (member) => member.number === formData.number
    );
    if (hasSameNumber) {
      return NextResponse.json(
        { error: "A member with the same number already exists" },
        { status: 409 }
      );
    }

    if (formData.email) {
      const hasSameEmail = members.find(
        (member) => member.meta.email === formData.email
      );
      if (hasSameEmail) {
        return NextResponse.json(
          { error: "A member with the same email already exists" },
          { status: 409 }
        );
      }
    }

    const newMember = new Member({
      team_id: formData.team_id,
      name: formData.name,
      number: formData.number,
      position: formData.position,
      meta: {
        admin: formData.admin,
        email: formData.email,
      },
    });

    // find the user and send invitation
    if (formData.email) {
      const targetUser = await User.findOne({ email: formData.email });
      if (targetUser) {
        targetUser.teams.inviting.push(formData.team_id);
        await targetUser.save();
      }
    }

    team.members.push(newMember._id);
    team.lineup.others.push(newMember._id);
    await team.save();
    await newMember.save();

    members.push(newMember);
    const response = NextResponse.json(
      { teamData: team, membersData: members, member: newMember },
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
    console.log("[post-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const PATCH = async (req) => {
  try {
    const { userData } = await verifyJwt(req);
    const { teamId, accept } = await req.json();

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const member = await Member.findOne({
      team_id: teamId,
      "meta.email": userData.email,
    });
    const user = await User.findById(userData._id);

    if (accept) {
      member.meta.user_id = userData._id;
      user.teams.joined.push(teamId);
      user.teams.inviting = user.teams.inviting.filter(
        (teamId) => !teamId.equals(teamId)
      );
    } else {
      member.meta.email = null;
      user.teams.inviting = user.teams.inviting.filter(
        (teamId) => !teamId.equals(teamId)
      );
    }

    await member.save();
    await user.save();

    const token = await signJwt(user);
    const hidePasswordUser = hidePassword(user);
    if (accept) {
      const members = await Member.find({ team_id: teamId });
      const response = NextResponse.json(
        { userData: hidePasswordUser, teamData: team, membersData: members },
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
    } else {
      const response = NextResponse.json(
        { userData: hidePasswordUser },
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
    }
  } catch (error) {
    console.log("[patch-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
