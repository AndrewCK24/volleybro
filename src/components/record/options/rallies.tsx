"use client";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { useRecord } from "@/src/hooks/use-data";
import { editingActions } from "@/src/lib/features/record/editing-slice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import Rally from "@/src/components/record/rally";

const RecordOptionsRallies = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const { record } = useRecord(recordId);
  const { setNum } = useAppSelector((state) => state.editing.status);
  const { rallies } = record.sets[setNum];
  const { players } = record.teams.home;

  // FIXME: 修正編輯狀態 inPlay, isSetPoint 計算邏輯
  const handleRallyClick = (rallyNum: number) => {
    dispatch(
      editingActions.setEditingRallyStatus({
        lineups: record.sets[setNum].lineups,
        recording: rallies[rallyNum],
        status: {
          isServing:
            rallyNum === 0
              ? record.sets[setNum].options.serve === "home"
              : rallies[rallyNum - 1].win,
          scores: {
            home: rallies[rallyNum].home.score,
            away: rallies[rallyNum].away.score,
          },
          setNum,
          rallyNum,
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
          onClick={() => dispatch(editingActions.setSetNum(setNum - 1))}
          disabled={setNum <= 0}
        >
          <FiChevronLeft />
          <span className="sr-only">last set</span>
        </Button>
        <span className="flex-1 text-xl text-center">
          第 {setNum + 1} 局逐球紀錄
        </span>
        <Button
          size="icon"
          className="w-8 h-8"
          onClick={() => dispatch(editingActions.setSetNum(setNum + 1))}
          disabled={setNum >= record.sets.length - 1}
        >
          <FiChevronRight />
          <span className="sr-only">next set</span>
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-1">
        <Separator content="比賽開始" />
        {rallies.map((rally, rallyNum: number) => (
          <Rally
            key={rallyNum}
            rally={rally}
            players={players}
            onClick={() => handleRallyClick(rallyNum)}
          />
        ))}
      </div>
    </>
  );
};

export default RecordOptionsRallies;
