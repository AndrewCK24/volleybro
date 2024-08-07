"use client";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const { home } = recordState.recording;

  const onOursClick = (action) => {
    dispatch(recordActions.setRecordingOursType(action));
  };

  const onOppoClick = (action) => {
    dispatch(recordActions.setRecordingOppoType(action));
  };

  return (
    <Card className={cn("flex-1 w-full pb-4", className)}>
      {home.num === null ? (
        <OursActions recordState={recordState} onOursClick={onOursClick} />
      ) : (
        <OppoActions recordState={recordState} onOppoClick={onOppoClick} />
      )}
    </Card>
  );
};

export default RecordActions;
