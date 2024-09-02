"use client";
import { useDispatch } from "react-redux";
import { frontActions, backActions, errorActions } from "@/lib/scoring-actions";
import { FiPlus, FiMinus, FiRepeat } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Container, ActionButton } from "@/components/record/panels/actions";

const OursActions = ({ recordState, recordActions }) => {
  const dispatch = useDispatch();
  const { recording } = recordState;
  const { zone } = recording.home.player;
  const oursActions =
    zone === 0
      ? errorActions
      : zone === 1 || zone >= 5
      ? backActions
      : frontActions;

  const onOursClick = (action) => {
    dispatch(recordActions.setRecordingOursAction(action));
  };

  return (
    <Container className={zone === 0 && "grid-cols-1"}>
      {oursActions.map((action) => (
        <ActionButton
          key={`${action.type}-${action.num}`}
          action={action}
          variant={
            action.win
              ? recording.home.num === action.num
                ? "default"
                : "option_win"
              : recording.home.num === action.num
              ? "destructive"
              : "option_lose"
          }
          onClick={() => onOursClick(action)}
        >
          {zone === 0 ? `對方${action.description}` : action.text}
          {action.win ? <FiPlus /> : <FiMinus />}
        </ActionButton>
      ))}
      {zone !== 0 && (
        <Button
          variant="secondary"
          size="lg"
          className="h-full text-[1.5rem] pr-1"
        >
          替補
          <FiRepeat />
        </Button>
      )}
    </Container>
  );
};

export default OursActions;
