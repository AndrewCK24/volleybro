import { NextRequest, NextResponse } from "next/server";
import { findMatchesController } from "@/interface/controllers/record/match.controller";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("ti");
    const lastId = searchParams.get("li");

    const input = { params: { teamId, lastId } };

    const results = await findMatchesController(input);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
