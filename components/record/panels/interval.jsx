import { useRecord } from "@/hooks/use-data";
import { Card } from "@/components/ui/card";
import RecordSetOptions from "@/components/record/set-options";

const RecordInterval = ({ recordId }) => {
  const { record } = useRecord(recordId);

  return (
    <Card className="items-center justify-center flex-1 w-full px-8 pb-4">
      <RecordSetOptions recordId={recordId} />
    </Card>
  );
};

export default RecordInterval;
