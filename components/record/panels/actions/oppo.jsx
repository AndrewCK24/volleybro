import { scoringActions } from "@/lib/scoring-actions";
import { FiPlus, FiMinus } from "react-icons/fi";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Container, ActionButton } from "@/components/record/panels/actions";

const OppoActions = ({ recordState, onOppoClick }) => {
  const { recording } = recordState;

  const oppoActions = scoringActions.filter((option) =>
    scoringActions[recording.home.num]?.outcome.includes(option.num)
  );

  return (
    <>
      <CardHeader>
        <CardTitle>對方得失分紀錄</CardTitle>
      </CardHeader>
      <Container className="grid-cols-1">
        {oppoActions.map((action) => (
          <ActionButton
            key={`${action.type}-${action.num + 15}`}
            action={action}
            variant={`${
              action.win === null
                ? "secondary"
                : action.win
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
          </ActionButton>
        ))}
      </Container>
    </>
  );
};

export default OppoActions;
