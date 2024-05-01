"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../team-slice";
import { matchActions } from "@/app/match/match-slice";
import { FiSave } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LineupCourt from "./LineupCourt";
import LineupOptions from "./LineupOptions";

const Lineup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isRecording = pathname.includes("match");
  const matchId = useSelector((state) => state.match._id) || "new";
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const setData = useSelector((state) => state.match.sets[setNum]);
  const [firstServe, setFirstServe] = useState(
    setData.meta.firstServe === null ? true : setData.meta.firstServe
  );
  const { _id: teamId, editingLineup } = useSelector((state) => state.team);
  const { starting, liberos, substitutes, others, status } = editingLineup;

  const handleSave = async () => {
    const lineup = {
      starting,
      liberos,
      substitutes,
      others,
    };
    if (status.edited) {
      try {
        const response = await fetch(`/api/teams/${teamId}/lineup`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lineup),
        });
        const { teamData } = await response.json();
        dispatch(teamActions.updateTeamOnly(teamData));
      } catch (error) {
        console.log(error);
      }
    }
    if (isRecording) {
      dispatch(matchActions.configMatchSet({ firstServe, lineup }));
      router.push(`/match/${matchId}/confirm`);
    }
  };

  const handleCancel = () => {
    dispatch(teamActions.resetEditingLineup());
    if (!isRecording) router.push("/team");
  };

  return (
    <>
      <LineupCourt />
      <Card className="flex-1 w-full">
        <LineupOptions />
      </Card>
      {status.optionMode || (
        <Card className="w-full py-0 bg-transparent shadow-none">
          <Button size="lg" onClick={handleSave}>
            <FiSave />
            儲存陣容
          </Button>
          {/* {isRecording ? (
          <>
            <ListItem type="secondary" text center onClick={handleCancel}>
              <FiRotateCcw />
              恢復預設
            </ListItem>
            <ListItem type="primary" center onClick={onSubmit}>
              <FiSave />
              確認陣容
            </ListItem>
          </>
        ) : (
          <>
            <ListItem type="secondary" text center onClick={handleCancel}>
              <FiX />
              取消編輯
            </ListItem>
            <ListItem
              type={
                !status.edited || status.editingZone ? "secondary" : "primary"
              }
              center
              disabled={!status.edited || status.editingZone}
              onClick={onSubmit}
            >
              <FiSave />
              儲存陣容
            </ListItem>
          </>
        )} */}
        </Card>
      )}
    </>
  );
};

export default Lineup;
