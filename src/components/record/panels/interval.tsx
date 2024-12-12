import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import RecordSetOptions from "@/components/record/set-options";

const RecordInterval = ({
  recordId,
  className,
}: {
  recordId: string;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "items-center justify-center flex-1 w-full px-8 pb-4",
        className
      )}
    >
      <RecordSetOptions recordId={recordId} />
    </Card>
  );
};

export default RecordInterval;
