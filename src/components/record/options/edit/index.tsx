"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { editingActions } from "@/lib/features/record/editing-slice";
import { FiChevronLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecordCourt from "@/components/record/court";
import RecordPreview from "@/components/record/preview";
import RecordMoves from "@/components/record/panels/moves";

const RalliesEdit = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const editingState = useAppSelector((state) => state.editing);

  return (
    <>
      <DialogHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(editingActions.setEditing(false))}
        >
          <FiChevronLeft />
          <span className="sr-only">back</span>
        </Button>
        <DialogTitle>編輯逐球紀錄</DialogTitle>
      </DialogHeader>
      <RecordCourt
        recordId={recordId}
        recordState={editingState}
        recordActions={editingActions}
      />
      <RecordPreview
        recordId={recordId}
        recordState={editingState}
        className="px-0 py-1 shadow-none"
      />
      <RecordMoves
        recordId={recordId}
        recordState={editingState}
        recordActions={editingActions}
        className="p-0 shadow-none"
      />
    </>
  );
};

export default RalliesEdit;
