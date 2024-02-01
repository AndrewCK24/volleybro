import { NextResponse } from "next/server";
import verifyJwt from "../utils/verify-jwt";
import signJwt from "../utils/sign-jwt";
import hidePassword from "../utils/hide-password";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const GET = async () => {
  try {
    const { userData, token } = await verifyJwt();
    const { joined, inviting } = userData.teams;
    const foundJoined = await Team.find({ _id: { $in: joined } });
    const foundInviting = await Team.find({ _id: { $in: inviting } });

    const byId = (order) => (a, b) =>
      order.indexOf(a._id.toString()) - order.indexOf(b._id.toString());
    const joinedTeams = foundJoined.sort(byId(joined));
    const invitingTeams = foundInviting.sort(byId(inviting));
    const response = NextResponse.json(
      { joined: joinedTeams, inviting: invitingTeams },
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
    console.log("[get-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const { userData } = await verifyJwt(req);
    const newMember = new Member({
      meta: {
        admin: true,
        email: userData.email,
        user_id: userData._id,
      },
      name: userData.name,
      number: 1,
    });

    const { name, nickname } = await req.json();
    // TODO: Add validation for name and nickname
    // if there is a team with the same name, ask the user to choose another name or join the existing team
    const newTeam = new Team({
      name,
      nickname,
      members: [newMember._id],
      lineup: {
        starting: [
          { member_id: null },
          { member_id: null },
          { member_id: null },
          { member_id: null },
          { member_id: null },
          { member_id: null },
        ],
        liberos: [{ member_id: null }],
        substitutes: [],
        others: [newMember._id],
      },
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

export const PATCH = async (req) => {
  try {
    const { userData, token } = await verifyJwt(req);
    const patchRequest = await req.json();
    const team = await Team.findById(patchRequest.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    const members = await Member.find({ team_id: patchRequest.teamId });
    const isAdmin = members.find(
      (member) => member.meta.user_id.toString() === userData._id.toString()
    )?.meta.admin;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to update this team" },
        { status: 401 }
      );
    }

    if (patchRequest.lineup) team.lineup = patchRequest.lineup;
    if (patchRequest.name) team.name = patchRequest.name;
    if (patchRequest.nickname) team.nickname = patchRequest.nickname;

    await team.save();

    const response = NextResponse.json(
      {
        userData,
        teamData: team,
        membersData: members,
      },
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
    console.log("[update-team]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
