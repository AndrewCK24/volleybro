"use client";
import { Card } from "@/components/ui/card";
import MatchCourt from "../MatchCourt";
import Preview from "../Preview";
import Options from "../Options";

const RecordPage = () => {
  return (
    <>
      <MatchCourt />
      <Card className="w-full p-2">
        <Preview />
      </Card>
      <Card className="flex-1 w-full p-2 pb-4">
        <Options />
      </Card>
    </>
  );
};

export default RecordPage;
