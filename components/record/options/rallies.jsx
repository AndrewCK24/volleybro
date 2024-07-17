"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { editingActions } from "@/app/store/editing-slice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Rally from "@/components/record/rally";

const RecordOptionsRallies = ({ recordId }) => {
  const dispatch = useDispatch();
  const { record } = useRecord(recordId);
  const { sets } = useSelector((state) => state.record);
  const {
    status: { setNum },
  } = useSelector((state) => state.editing);
  const { rallies } = sets[setNum];
  const { players } = record.teams.home;

  const handleRallyClick = (rallyNum) => {
    dispatch(
      editingActions.setStatus({
        lineups: record.sets[setNum].lineups,
        recording: rallies[rallyNum],
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
        {rallies.map((rally, rallyNum) => (
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
