"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RecordSetOptions from "@/components/record/set-options";

const RecordInterval = ({
  recordId,
  className,
}: {
  recordId: string;
  className?: string;
}) => {
  const { inProgress } = useAppSelector((state) => state.record.general.status);

  return (
    <Card
      className={cn(
        "items-center justify-center flex-1 w-full px-8 pb-4",
        className
      )}
    >
      <Dialog defaultOpen={!inProgress}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            開始下一局
          </Button>
        </DialogTrigger>
        <RecordSetOptions recordId={recordId} />
      </Dialog>
    </Card>
  );
};

export default RecordInterval;
