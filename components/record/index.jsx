"use client";
import { useRecord } from "@/hooks/use-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/record/header";
import RecordCourt from "@/components/record/court";
import LoadingCourt from "@/components/custom/loading/court";
import LoadingCard from "@/components/custom/loading/card";

const Record = ({ recordId }) => {
  const { record, isLoading, error } = useRecord(recordId);

  if (error) throw new Error(error);
  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingCourt />
        <LoadingCard className="flex-1 w-full pb-4" />
      </>
    );
  }

  return (
    <>
      <Header recordId={recordId} />
      <RecordCourt />
      <Card className="flex-1 w-full pb-4">
        <CardHeader>
          <CardTitle>Record</CardTitle>
        </CardHeader>
        <div>{record.team_id}</div>
      </Card>
    </>
  );
};

export default Record;
