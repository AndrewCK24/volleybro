"use client";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import OursActions from "@/components/record/panels/actions/ours";
import OppoActions from "@/components/record/panels/actions/oppo";

export const Container = ({ children, className }) => {
  return (
    <div className={cn("grid flex-1 w-full grid-cols-2 gap-2", className)}>
      {children}
    </div>
  );
};

export const ActionButton = ({ action, variant, onClick, children }) => {
  return (
    <Button
      key={`${action.type}-${action.num}`}
      variant={variant}
      size="lg"
      className="h-full text-[1.5rem] pr-1 transition-colors duration-200"
      onClick={() => onClick(action)}
    >
      {children}
    </Button>
  );
};

const RecordActions = ({ recordState, recordActions, className }) => {
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
        <OursActions recordState={recordState} recordActions={recordActions} />
      ) : (
        <OppoActions recordState={recordState} recordActions={recordActions} />
      )}
    </Card>
  );
};

export default RecordActions;
