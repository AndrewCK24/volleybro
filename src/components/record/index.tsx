"use client";
import { useState, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "@/src/lib/redux/hooks";
import { recordActions } from "@/src/lib/features/record/record-slice";
import { editingActions } from "@/src/lib/features/record/editing-slice";
import { useRecord } from "@/src/hooks/use-data";
import { Card } from "@/src/components/ui/card";
import { Dialog } from "@/src/components/ui/dialog";
import Header from "@/src/components/record/header";
import RecordCourt from "@/src/components/record/court";
import RecordPreview from "@/src/components/record/preview";
import RecordPanels from "@/src/components/record/panels";
import RecordOptions from "@/src/components/record/options";
import LoadingCourt from "@/src/components/custom/loading/court";
import LoadingCard from "@/src/components/custom/loading/card";

const Record = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const recordState = useAppSelector((state) => state.record);
  const { record, isLoading, error } = useRecord(recordId);

  const initialized = useRef(false);
  const store = useAppStore();

  const handleOptionOpen = (tabValue: string) => {
    dispatch(editingActions.initialize(record));
    setTabValue(tabValue);
    setDialogOpen(true);
  };

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
  
  if (!initialized.current) {
    store.dispatch(recordActions.initialize(record));
    initialized.current = true;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Header recordId={recordId} handleOptionOpen={handleOptionOpen} />
      <RecordCourt
        recordId={recordId}
        recordState={recordState}
        recordActions={recordActions}
      />
      <RecordPreview
        recordId={recordId}
        recordState={recordState}
        handleOptionOpen={handleOptionOpen}
      />
      <RecordPanels
        recordId={recordId}
        recordState={recordState}
        recordActions={recordActions}
      />
      <RecordOptions
        recordId={recordId}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
    </Dialog>
  );
};

export default Record;
