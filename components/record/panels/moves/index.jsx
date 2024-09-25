"use client";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import OursMoves from "@/components/record/panels/moves/ours";
import OppoMoves from "@/components/record/panels/moves/oppo";

export const Container = ({ children, className }) => {
  return (
    <div className={cn("grid flex-1 w-full grid-cols-2 gap-2", className)}>
      {children}
    </div>
  );
};

export const MoveButton = ({ move, variant, onClick, children }) => {
  return (
    <Button
      key={`${move.type}-${move.num}`}
      variant={variant}
      size="lg"
      className="h-full text-[1.5rem] pr-1 transition-colors duration-200"
      onClick={() => onClick(move)}
    >
      {children}
    </Button>
  );
};

const RecordMoves = ({ recordId, recordState, recordActions, className }) => {
  const dispatch = useDispatch();
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
