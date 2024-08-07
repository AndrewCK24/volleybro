import { frontActions, backActions, errorActions } from "@/lib/scoring-actions";
import { FiPlus, FiMinus, FiRepeat } from "react-icons/fi";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Container, ActionButton } from "@/components/record/panels/actions";

const OursActions = ({ recordState, onOursClick }) => {
  const { recording } = recordState;
  const { zone } = recording.home.player;
  const oursActions =
    zone === 0
      ? errorActions
      : zone === 1 || zone >= 5
      ? backActions
      : frontActions;

  return (
    <>
      <CardHeader>
        <CardTitle>我方得失分紀錄</CardTitle>
      </CardHeader>
      <Container className={zone === 0 && "grid-cols-1"}>
        {oursActions.map((action) => (
          <ActionButton
            key={`${action.type}-${action.num}`}
            action={action}
            variant={
              action.win === null
                ? "secondary"
                : action.win
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
            {action.win === null ? (
              <FiRepeat />
            ) : action.win ? (
              <FiPlus className="text-primary" />
            ) : (
              <FiMinus className="text-destructive" />
            )}
          </ActionButton>
        ))}
      </Container>
    </>
  );
};

export default OursActions;
