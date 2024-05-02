import { NextResponse } from "next/server";
import verifyJwt from "../../utils/verify-jwt";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const PUT = async (req, { params }) => {
  try {
    const { userData, token } = await verifyJwt(req);
    const formData = await req.json();
    const { memberId } = params;

    const updatingMember = await Member.findById(memberId);
    if (!updatingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const team = await Team.findById(updatingMember.team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: updatingMember.team_id });

    // only admins can edit members
    const userIsMember = members.find(
      (member) => member.meta.user_id.toString() === userData._id.toString()
    );
    if (!userIsMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userIsAdmin = userIsMember.meta.admin;
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    updatingMember.name = formData.name;
    updatingMember.position = formData.position;
    const isNumberChanged = updatingMember.number !== formData.number;
    if (isNumberChanged) {
      const hasSameNumber = members.find(
        (member) => member.number === formData.number
      );
      if (hasSameNumber) {
        return NextResponse.json(
          { error: "A member with the same number already exists" },
          { status: 409 }
        );
      }
      updatingMember.number = formData.number;
    }

    const isEmailChanged = updatingMember.meta.email !== formData.email;
    if (isEmailChanged) {
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
      // handle invitation
      if (updatingMember.meta.user_id) {
        const removedUser = await User.findById(updatingMember.meta.user_id);
        if (removedUser) {
          removedUser.teams.joined = removedUser.teams.joined.filter(
            (teamId) => !teamId.equals(formData.team_id)
          );
          await removedUser.save();
        }
        updatingMember.meta.user_id = null;
      } else if (updatingMember.meta.email) {
        const removedUser = await User.findOne({
          email: updatingMember.meta.email,
        });
        if (removedUser) {
          removedUser.teams.inviting = removedUser.teams.inviting.filter(
            (teamId) => !teamId.equals(formData.team_id)
          );
          await removedUser.save();
        }
      }
      if (formData.email) {
        updatingMember.meta.email = formData.email;
        const invitingUser = await User.findOne({
          email: formData.email,
        });
        if (invitingUser) {
          if (!invitingUser.teams.inviting.includes(formData.team_id)) {
            invitingUser.teams.inviting.push(formData.team_id);
            await invitingUser.save();
          }
        }
      } else {
        updatingMember.meta.email = null;
      }
    }
    updatingMember.meta.admin = formData.admin;
    console.log(updatingMember);
    await updatingMember.save();

    const targetIndex = members.findIndex(
      (member) => member._id.toString() === memberId
    );
    members[targetIndex] = updatingMember;
    const response = NextResponse.json(
      { teamData: team, membersData: members, member: updatingMember },
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
    console.log("[put-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};