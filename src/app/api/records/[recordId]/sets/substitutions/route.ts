import { NextRequest, NextResponse } from "next/server";
import { createSubstitutionController } from "@/interface/controllers/record/substitution.controller";

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const substitution = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const setIndex = parseInt(searchParams.get("si") || "0", 10);
    const entryIndex = parseInt(searchParams.get("ei") || "0", 10);

    const entries = await createSubstitutionController({
      params: { recordId, setIndex, entryIndex },
      data: substitution,
    });
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.log("[POST /api/records/sets/substitutions]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
