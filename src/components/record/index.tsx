"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { useRecord } from "@/hooks/use-data";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import Header from "@/components/record/header";
import RecordCourt from "@/components/record/court";
import RecordPreview from "@/components/record/preview";
import RecordPanels from "@/components/record/panels";
import RecordOptions from "@/components/record/options";
import LoadingCourt from "@/components/custom/loading/court";
import LoadingCard from "@/components/custom/loading/card";

const Record = ({ recordId }: { recordId: string }) => {
  const { record, isLoading, error } = useRecord(recordId);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const recordState = useAppSelector((state) => state.record);

  const handleOptionOpen = (tabValue: string) => {
    dispatch(recordActions.initialize(record));
    setTabValue(tabValue);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (record) dispatch(recordActions.initialize(record));
  }, [recordId, record, dispatch]);

  if (error) throw error;
  if (isLoading || recordState._id !== recordId) {
    return (
      <>
        <Header />
        <LoadingCourt />
        <Card className="grid w-full p-2">
          <div className="h-8 rounded-md motion-safe:animate-pulse bg-muted" />
        </Card>
        <LoadingCard className="flex-1 w-full pb-4" />
      </>
    );
  }

  return (
    <>
      <Header recordId={record._id} handleOptionOpen={handleOptionOpen} />
      <RecordCourt recordId={record._id} mode="general" />
      <RecordPreview
        recordId={record._id}
        mode="general"
        handleOptionOpen={handleOptionOpen}
      />
      <RecordPanels
        recordId={record._id}
        className="pb-[max(calc(env(safe-area-inset-bottom)-1rem),1.5rem)]"
        mode="general"
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <RecordOptions
          recordId={record._id}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      </Dialog>
    </>
  );
};

export default Record;
