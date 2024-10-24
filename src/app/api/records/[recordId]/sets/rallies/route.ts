import { NextRequest, NextResponse } from "next/server";
import { createRallyController } from "@/interface/controllers/record/create-rally.controller";

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const rally = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const setIndex = parseInt(searchParams.get("si") || "0", 10);
    const rallyIndex = parseInt(searchParams.get("ri") || "0", 10);

    const rallies = await createRallyController({
      params: { recordId, setIndex, rallyIndex },
      data: rally,
    });
    return NextResponse.json(rallies, { status: 200 });
  } catch (error) {
    console.log("[POST /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
