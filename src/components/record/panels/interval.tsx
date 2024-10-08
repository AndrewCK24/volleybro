import { Card } from "@/components/ui/card";
import RecordSetOptions from "@/components/record/set-options";

const RecordInterval = ({ recordId }: { recordId: string }) => {
  return (
    <Card className="items-center justify-center flex-1 w-full px-8 pb-4">
      <RecordSetOptions recordId={recordId} />
    </Card>
  );
};

export default RecordInterval;
