import { useRecord } from "@/src/hooks/use-data";
import { Card } from "@/src/components/ui/card";
import RecordSetOptions from "@/src/components/record/set-options";

const RecordInterval = ({ recordId }) => {
  const { record } = useRecord(recordId);

  return (
    <Card className="items-center justify-center flex-1 w-full px-8 pb-4">
      <RecordSetOptions recordId={recordId} />
    </Card>
  );
};

export default RecordInterval;
