import { NextRequest, NextResponse } from "next/server";
import { addRallyController } from "@/interface/controllers/record/add-rally.controller";

export const POST = async (req: NextRequest, { params }) => {
  try {
    const rally = await req.json();
    const { recordId } = params;
    const searchParams = req.nextUrl.searchParams;
    const setNum = parseInt(searchParams.get("setNum") || "0", 10);
    const rallyNum = parseInt(searchParams.get("rallyNum") || "0", 10);

    const rallies = await addRallyController(
      { id: recordId, setNum, rallyNum },
      rally
    );
    return NextResponse.json(rallies, { status: 200 });
    // const session = await auth();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // await connectToMongoDB();
    // const user = await User.findById(session.user._id);
    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // const { recordId, setNum } = params;

    // const record = await Record.findById(recordId);
    // if (!record) {
    //   return NextResponse.json({ error: "Record not found" }, { status: 404 });
    // }
    // const set = record.sets[setNum];
    // if (!set) {
    //   return NextResponse.json({ error: "Set not found" }, { status: 404 });
    // }

    // // TODO: handle race condition
    // const rally = await req.json();
    // record.sets[setNum].rallies.push(rally);
    // await record.save();

    // return NextResponse.json(record.sets[setNum].rallies, { status: 200 });
  } catch (error) {
    console.log("[POST /api/records]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
