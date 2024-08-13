"use client";
import { useDispatch } from "react-redux";
import { scoringActions } from "@/lib/scoring-actions";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Container, ActionButton } from "@/components/record/panels/actions";

const OppoActions = ({ recordState, recordActions }) => {
  const dispatch = useDispatch();
  const { recording } = recordState;

  const oppoActions = scoringActions.filter((option) =>
    scoringActions[recording.home.num]?.outcome.includes(option.num)
  );

  const onOppoClick = (action) => {
    dispatch(recordActions.setRecordingOppoAction(action));
  };

  return (
    <Container className="grid-cols-1">
      {recording.home.num === null ? (
        <Button
          variant="outline"
          size="lg"
          className="h-full"
          onClick={() => dispatch(recordActions.setRecordingMode("home"))}
        >
          請先選擇我方得失分紀錄
        </Button>
      ) : (
        <>
          {oppoActions.map((action) => (
            <ActionButton
              key={`${action.type}-${action.num + 15}`}
              action={action}
              variant={`${
                action.win
                  ? recording.away.num === action.num
                    ? "default"
                    : "option_win"
                  : recording.away.num === action.num
                  ? "destructive"
                  : "option_lose"
              }`}
              onClick={() => onOppoClick(action)}
            >
              {action.type === "oppo-error"
                ? `我方${action.description}`
                : `對方${action.text}`}
              {action.win ? <FiPlus /> : <FiMinus />}
              {recording.away.num === action.num && <FiSend />}
            </ActionButton>
          ))}
        </>
      )}
    </Container>
  );
};

export default OppoActions;
