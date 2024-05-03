"use client";
import { Card } from "@/components/ui/card";
import MatchCourt from "../MatchCourt";
import Preview from "../Preview";
import Options from "../Options";

const RecordPage = () => {
  return (
    <>
      <Card className="w-full">
        <MatchCourt />
      </Card>
      <Card className="w-full">
        <Preview />
      </Card>
      <Card className="flex-1 w-full">
        <Options />
      </Card>
    </>
  );
};

export default RecordPage;
