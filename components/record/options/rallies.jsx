"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { recordActions } from "@/app/store/record-slice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import Rally from "@/components/record/rally";

const RecordOptionsRallies = ({ recordId }) => {
  const dispatch = useDispatch();
  const { record } = useRecord(recordId);
  const { status, sets } = useSelector((state) => state.record);
  const [setNum, setSetNum] = useState(status.setNum);
  const { rallies } = sets[setNum];
  const { players } = record.teams.home;

  // const handleRallyClick = (rallyNum) => {
  //   dispatch(
  //     recordActions.setEditingStatus({
  //       recording: rallies[rallyNum],
  //       isServing:
  //         rallyNum === 0
  //           ? record.sets[setNum].options.serve === "home"
  //           : rallies[rallyNum - 1].win,
  //       scores: {
  //         home: rallies[rallyNum].home.score,
  //         away: rallies[rallyNum].away.score,
  //       },
  //       setNum,
  //       rallyNum,
  //       inPlay: true,
  //     })
  //   );
  // };

  return (
    <>
      <div className="flex flex-row items-center w-full">
        <Button
          size="icon"
          className="w-8 h-8"
          onClick={() => setSetNum(setNum - 1)}
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
          onClick={() => setSetNum(setNum + 1)}
          disabled={setNum >= record.sets.length - 1}
        >
          <FiChevronRight />
          <span className="sr-only">next set</span>
        </Button>
      </div>
      <DialogFooter className="flex flex-col-reverse gap-1">
        {rallies.map((rally, rallyNum) => (
          // <DialogClose key={rallyNum} asChild>
          <Rally
            key={rallyNum}
            rally={rally}
            players={players}
            // onClick={() => handleRallyClick(rallyNum)}
          />
          // </DialogClose>
        ))}
      </DialogFooter>
    </>
  );
};

export default RecordOptionsRallies;
