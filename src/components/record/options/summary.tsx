"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRecord } from "@/hooks/use-data";
import { editingActions } from "@/lib/features/record/editing-slice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Rally from "@/components/record/entry/rally";

const RecordOptionsSummary = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const { record } = useRecord(recordId);
  const { setIndex } = useAppSelector((state) => state.editing.status);
  const { rallies } = record.sets[setIndex];
  const { players } = record.teams.home;

  // FIXME: 修正編輯狀態 inPlay, isSetPoint 計算邏輯
  const handleRallyClick = (rallyIndex: number) => {
    dispatch(
      editingActions.setEditingRallyStatus({
        recording: rallies[rallyIndex],
        status: {
          isServing:
            rallyIndex === 0
              ? record.sets[setIndex].options.serve === "home"
              : rallies[rallyIndex - 1].win,
          scores: {
            home: rallies[rallyIndex].home.score,
            away: rallies[rallyIndex].away.score,
          },
          setIndex,
          rallyIndex,
          inPlay: true,
          isSetPoint: false,
          recordingMode: "away",
        },
      })
    );
  };

  return (
    <>
      <div className="flex flex-row items-center w-full">
        <Button
          size="icon"
          className="w-8 h-8"
          onClick={() => dispatch(editingActions.setSetIndex(setIndex - 1))}
          disabled={setIndex <= 0}
        >
          <FiChevronLeft />
          <span className="sr-only">last set</span>
        </Button>
        <span className="flex-1 text-xl text-center">
          第 {setIndex + 1} 局逐球紀錄
        </span>
        <Button
          size="icon"
          className="w-8 h-8"
          onClick={() => dispatch(editingActions.setSetIndex(setIndex + 1))}
          disabled={setIndex >= record.sets.length - 1}
        >
          <FiChevronRight />
          <span className="sr-only">next set</span>
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-1">
        <Separator content="比賽開始" />
        {rallies.map((rally, rallyIndex: number) => (
          <Rally
            key={rallyIndex}
            rally={rally}
            players={players}
            onClick={() => handleRallyClick(rallyIndex)}
          />
        ))}
      </div>
    </>
  );
};

export default RecordOptionsSummary;
