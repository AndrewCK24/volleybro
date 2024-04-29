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
      meta: {
        admin: formData.admin,
        email: formData.email,
      },
      name: formData.name,
      number: formData.number,
      position: formData.position,
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

export const PUT = async (req) => {
  try {
    const { userData, token } = await verifyJwt(req);
    const formData = await req.json();

    // find the team
    const team = await Team.findById(formData.team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: formData.team_id });

    // any admin can update members
    const userIsAdmin = members.find(
      (member) => member.meta.user_id.toString() === userData._id.toString()
    ).meta.admin;
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // find the member
    const targetIndex = members.findIndex((member) =>
      member._id.equals(formData._id)
    );
    if (targetIndex === -1) {
      console.log(`[put-teams] Member not found`);
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    const updatingMember = await Member.findById(formData._id);

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
