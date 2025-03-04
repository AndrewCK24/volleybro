"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { cn } from "@/lib/utils";
import { RiEditBoxLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import OursMoves from "@/components/record/panels/moves/ours";
import OppoMoves from "@/components/record/panels/moves/oppo";

export const Container = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <CardContent className={cn("grid flex-1 w-full grid-cols-2", className)}>
      {children}
    </CardContent>
  );
};

export const MoveButton = ({ move, toggled, onClick, children }) => {
  const WIN_STYLE =
    "bg-[hsl(190.91,29.73%,78.24%)] text-foreground [&>svg]:text-primary shadow-sm hover:bg-primary/80";
  const LOSE_STYLE =
    "bg-[hsl(13.2,96.15%,89.8%)] text-foreground [&>svg]:text-destructive shadow-sm hover:bg-destructive/80";

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
  className,
}: {
  recordId: string;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const recordState = useAppSelector((state) => state.record);
  const { status, recording } = recordState[recordState.mode];

  return (
    <Card className={cn("flex-1 w-full pb-4", className)}>
      <CardHeader className="flex-row">
        <CardTitle
          onClick={() => dispatch(recordActions.setPanel("home"))}
          className={cn(
            "p-1 border-l-2 border-b-2 border-primary transition-all overflow-hidden text-nowrap",
            status.panel === "home" ? "w-full" : "w-[2rem]"
          )}
        >
          <RiEditBoxLine className="w-6 min-w-6" />
          我方得失分紀錄
        </CardTitle>
        <CardTitle
          onClick={() => dispatch(recordActions.setPanel("away"))}
          className={cn(
            "p-1 border-l-2 border-b-2 border-destructive transition-all overflow-hidden text-nowrap",
            status.panel !== "home"
              ? "w-full"
              : recording.home.num === null
              ? "w-0 sr-only"
              : "w-[2rem]"
          )}
        >
          <RiEditBoxLine className="w-6 min-w-6" />
          對方得失分紀錄
        </CardTitle>
      </CardHeader>
      {status.panel === "home" ? (
        <OursMoves />
      ) : (
        <OppoMoves recordId={recordId} />
      )}
    </Card>
  );
};

export default RecordMoves;
