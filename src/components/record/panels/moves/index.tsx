"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import OursMoves from "@/components/record/panels/moves/ours";
import OppoMoves from "@/components/record/panels/moves/oppo";

import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

export const Container = ({ children, className }) => {
  return (
    <div className={cn("grid flex-1 w-full grid-cols-2 gap-2", className)}>
      {children}
    </div>
  );
};

export const MoveButton = ({ move, toggled, onClick, children }) => {
  const WIN_STYLE =
    "bg-[rgba(183,210,216,1)] text-foreground [&>svg]:text-primary shadow hover:bg-primary/80";
  const LOSE_STYLE =
    "bg-[rgba(254,215,204,1)] text-foreground [&>svg]:text-destructive shadow hover:bg-destructive/80";

  return (
    <Button
      key={`${move.type}-${move.num}`}
      variant={move.win ? "default" : "destructive"}
      size="lg"
      className={cn(
        "h-full text-[1.5rem] pr-1 transition-colors duration-200",
        toggled || (move.win ? WIN_STYLE : LOSE_STYLE)
      )}
      onClick={() => onClick(move)}
    >
      {children}
    </Button>
  );
};

const RecordMoves = ({
  recordId,
  recordState,
  recordActions,
  className,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const { status, recording } = recordState;

  return (
    <Card className={cn("flex-1 w-full pb-4", className)}>
      <CardHeader>
        <CardTitle
          onClick={() => dispatch(recordActions.setRecordingMode("home"))}
          className={cn(
            "p-1 border-l-2 border-b-2 border-primary transition-all overflow-hidden text-nowrap",
            status.recordingMode === "home" ? "w-full" : "w-[2rem]"
          )}
        >
          <FiEdit2 className="w-6 min-w-6" />
          我方得失分紀錄
        </CardTitle>
        <CardTitle
          onClick={() => dispatch(recordActions.setRecordingMode("away"))}
          className={cn(
            "p-1 border-l-2 border-b-2 border-destructive transition-all overflow-hidden text-nowrap",
            status.recordingMode !== "home"
              ? "w-full"
              : recording.home.num === null
              ? "w-0 sr-only"
              : "w-[2rem]"
          )}
        >
          <FiEdit2 className="w-6 min-w-6" />
          對方得失分紀錄
        </CardTitle>
      </CardHeader>
      {status.recordingMode === "home" ? (
        <OursMoves recordState={recordState} recordActions={recordActions} />
      ) : (
        <OppoMoves
          recordId={recordId}
          recordState={recordState}
          recordActions={recordActions}
        />
      )}
    </Card>
  );
};

export default RecordMoves;
