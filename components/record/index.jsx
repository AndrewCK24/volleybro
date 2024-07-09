"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { recordActions } from "@/app/store/record-slice";
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

const Record = ({ recordId }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const { record, isLoading, error } = useRecord(recordId);

  const handleOptionOpen = (tabValue) => {
    setTabValue(tabValue);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (record) dispatch(recordActions.initialize(record));
  }, [record, dispatch]);

  if (error) throw new Error(error);
  if (isLoading) {
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Header recordId={recordId} handleOptionOpen={handleOptionOpen} />
      <RecordCourt recordId={recordId} />
      <RecordPreview recordId={recordId} handleOptionOpen={handleOptionOpen} />
      <RecordPanels recordId={recordId} />
      <RecordOptions size="lg" tabValue={tabValue} setTabValue={setTabValue} />
    </Dialog>
  );
};

export default Record;
