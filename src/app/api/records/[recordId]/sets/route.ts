import { NextRequest, NextResponse } from "next/server";
import { createSetController } from "@/interface/controllers/record/create-set.controller";

export const POST = async (
  req: NextRequest,
  { params }: { params: { recordId: string } }
) => {
  try {
    const request = await req.json();
    const { recordId } = params;
    const searchParams = req.nextUrl.searchParams;
    const setIndex = parseInt(searchParams.get("si") || "0", 10);

    const input = {
      params: { recordId, setIndex },
      data: {
        lineup: request.lineup,
        options: request.options,
      },
    };

    const record = await createSetController(input);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.log("[CREATE SET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
