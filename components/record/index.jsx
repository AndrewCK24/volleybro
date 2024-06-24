"use client";
import { useRecord } from "@/hooks/use-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingCard from "@/components/custom/loading/card";

const Record = ({ recordId, className }) => {
  const { record, isLoading, error } = useRecord(recordId);

  if (error) throw new Error(error);
  if (isLoading) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Record</CardTitle>
      </CardHeader>
      <div>{record.team_id}</div>
    </Card>
  );
};

export default Record;
