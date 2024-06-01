"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/app/store/lineups-slice";
import { FiSave } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import LineupCourt from "@/components/team/lineup/court";
import LineupOptions from "@/components/team/lineup/options";
import LoadingCourt from "@/components/custom/loading/court";
import LoadingCard from "@/components/custom/loading/card";

const Lineup = ({ team, members, handleSave }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  // const pathname = usePathname();
  // const isRecording = pathname.includes("match");
  // const { setNum } = useSelector((state) => state.match.status.editingData);
  // const setData = useSelector((state) => state.match.sets[setNum]);
  // const [firstServe, setFirstServe] = useState(
  //   setData.meta.firstServe === null ? true : setData.meta.firstServe
  // );

  useEffect(() => {
    if (team && team.lineup) dispatch(lineupsActions.initiate(team.lineup));
  }, [team, dispatch]);

  if (!team || !members) {
    return (
      <>
        <LoadingCourt />
        <LoadingCard className="flex-1 w-full" />
        <div className="flex flex-col w-full px-4">
          <Button size="lg" className="motion-safe:animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <LineupCourt members={members} />
      <LineupOptions
        team={team}
        members={members}
        className="flex-1 w-full overflow-scroll"
      />
      {!status.optionMode && (
        <div className="flex flex-col w-full px-4">
          <Button
            size="lg"
            onClick={() => handleSave(lineups[0])}
            disabled={!status.edited}
          >
            <FiSave />
            儲存陣容
          </Button>
        </div>
      )}
    </>
  );
};

export default Lineup;
