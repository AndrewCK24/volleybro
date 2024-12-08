"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { RiArrowLeftWideLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecordCourt from "@/components/record/court";
import RecordPreview from "@/components/record/preview";
import RecordPanels from "@/components/record/panels";

const EntriesEdit = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <DialogHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(recordActions.setRecordMode("general"))}
        >
          <RiArrowLeftWideLine />
          <span className="sr-only">back</span>
        </Button>
        <DialogTitle>編輯逐球紀錄</DialogTitle>
      </DialogHeader>
      <RecordCourt recordId={recordId} mode="editing" />
      <RecordPreview
        recordId={recordId}
        mode="editing"
        className="px-0 py-1 shadow-none"
      />
      <RecordPanels
        recordId={recordId}
        mode="editing"
        className="p-0 shadow-none"
      />
    </>
  );
};

export default EntriesEdit;
