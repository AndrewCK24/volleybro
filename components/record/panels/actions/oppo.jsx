"use client";
import { useDispatch } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { scoringActions } from "@/lib/scoring-actions";
import { FiPlus, FiMinus, FiSend } from "react-icons/fi";
import { Container, ActionButton } from "@/components/record/panels/actions";

const OppoActions = ({ recordId, recordState, recordActions }) => {
  const dispatch = useDispatch();
  const { record, mutate } = useRecord(recordId);
  const {
    status: { setNum, rallyNum },
    recording,
  } = recordState;

  const oppoActions = scoringActions.filter((option) =>
    scoringActions[recording.home.num]?.outcome.includes(option.num)
  );

  const onOppoClick = async (action) => {
    if (recording.away.num !== action.num) {
      dispatch(recordActions.setRecordingOppoAction(action));
    } else {
      const updateRallies = async () => {
        try {
          const res = await fetch(
            `/api/records/${recordId}/sets/${setNum}/rallies`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(recording),
            }
          );
          if (!res.ok) throw new Error("Network response was not ok");
          const rallies = await res.json();
          record.sets[setNum].rallies = rallies;
          return record;
        } catch (error) {
          console.error("[POST /api/records]", error);
        }
      };
      mutate(updateRallies(), {
        revalidate: false,
        optimisticData: (record) => {
          record.sets[setNum].rallies.push(recording);
          return record;
        },
      });
      dispatch(recordActions.resetRecording());
    }
  };

  return (
    <Container className="grid-cols-1">
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
    </Container>
  );
};

export default OppoActions;
