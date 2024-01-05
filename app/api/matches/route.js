import { NextResponse } from "next/server";
import verifyJwt from "../utils/verify-jwt";
import Team from "@/app/models/team";
import Match from "@/app/models/match";

export const POST = async (req) => {
  try {
    const { userData, token } = await verifyJwt(req);
    const matchData = await req.json();

    const isUserInTeam = userData.teams.joined.some(
      (teamId) => teamId.toString() === matchData.team_id
    );
    if (!isUserInTeam) {
      console.log(`[CREATE MATCH] USER(${userData.email}) Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(matchData.team_id);
    if (!team) {
      console.log(`[CREATE MATCH] TEAM(${matchData.team_id}) Team not found`);
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const newMatch = new Match({
      team_id: matchData.team_id,
      info: matchData.info,
      sets: matchData.sets,
    });
    await newMatch.save();

    team.matches.unshift(newMatch._id);
    await team.save();

    const response = NextResponse.json(
      { teamData: team, newMatch: newMatch._id },
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
    console.log("[CREATE MATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
