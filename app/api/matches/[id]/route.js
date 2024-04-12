import { NextResponse } from "next/server";
import verifyJwt from "../../utils/verify-jwt";
import Match from "@/app/models/match";

export const GET = async (req, { params }) => {
  const matchId = params.id;
  try {
    const { userData } = await verifyJwt(req);
    const matchData = await Match.findById(matchId);
    if (!matchData) {
      console.log(`[GET MATCH] MATCH(${matchId}) Match not found`);
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const isUserInTeam = userData.teams.joined.some(
      (teamId) => teamId.toString() === matchData.team_id.toString()
    );
    if (!isUserInTeam) {
      console.log(`[GET MATCH] USER(${userData.email}) Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ matchData }, { status: 200 });
  } catch (error) {
    console.log("[GET MATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
