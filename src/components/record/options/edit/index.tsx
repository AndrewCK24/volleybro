"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { RiArrowLeftWideLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import RecordCourt from "@/components/record/court";
import RecordPreview from "@/components/record/preview";
import RecordPanels from "@/components/record/panels";

const EntriesEdit = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <DialogHeader className="flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(recordActions.setRecordMode("general"))}
        >
          <RiArrowLeftWideLine />
          <span className="sr-only">back</span>
        </Button>
        <DialogTitle>編輯逐球紀錄</DialogTitle>
        <DialogDescription className="sr-only">
          逐球紀錄編輯頁面
        </DialogDescription>
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
