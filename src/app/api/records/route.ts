import { NextRequest, NextResponse } from "next/server";
import { getRecordController } from "@/interface/controllers/record/get-record.controller";
import { createRecordController } from "@/interface/controllers/record/create-record.controller";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("ti");

    const input = { params: { teamId } };

    const records = await getRecordController(input);

    // TODO: `find-team-records` use case 僅需回傳各場比賽結果，不需包含整筆 record 資料
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.log("[GET /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const request = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("ti");

    const input = {
      params: { teamId },
      data: {
        info: request.info,
        team: request.team,
        lineup: request.lineup,
      },
    };

    const record = await createRecordController(input);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.log("[CREATE RECORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
