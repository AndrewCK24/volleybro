import { NextRequest, NextResponse } from "next/server";
import { getRecordController } from "@/interface/controllers/record/get-record.controller";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ recordId: string }> }
) => {
  const params = await props.params;
  const { recordId } = params;
  try {
    const input = { params: { _id: recordId } };

    const record = await getRecordController(input);

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.log("[GET /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
