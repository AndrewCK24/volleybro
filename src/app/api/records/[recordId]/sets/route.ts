import { NextRequest, NextResponse } from "next/server";
import { createSetController } from "@/interface/controllers/record/create-set.controller";
import { updateSetController } from "@/interface/controllers/record/update-set.controller";

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const request = await req.json();
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

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const request = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const setIndex = parseInt(searchParams.get("si") || "0", 10);

    const input = {
      params: { recordId, setIndex },
      data: {
        options: request.options,
      },
    };

    const record = await updateSetController(input);

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.log("[UPDATE SET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
