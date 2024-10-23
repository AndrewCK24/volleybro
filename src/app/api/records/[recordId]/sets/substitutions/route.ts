import { NextRequest, NextResponse } from "next/server";
import { createSubstitutionController } from "@/interface/controllers/record/create-substitution.controller";

export const POST = async (req: NextRequest, { params }) => {
  try {
    const substitution = await req.json();
    const { recordId } = params;
    const searchParams = req.nextUrl.searchParams;
    const setIndex = parseInt(searchParams.get("si") || "0", 10);
    const rallyIndex = parseInt(searchParams.get("ri") || "0", 10);

    const substitutions = await createSubstitutionController({
      params: { recordId, setIndex, rallyIndex },
      data: substitution,
    });
    return NextResponse.json(substitutions, { status: 200 });
  } catch (error) {
    console.log("[POST /api/records/sets/substitutions]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
