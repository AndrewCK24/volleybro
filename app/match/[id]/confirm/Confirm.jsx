"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "@/app/store/team-slice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmCourt from "./ConfirmCourt";
import ConfirmInfo from "./ConfirmInfo";

const Confirm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const matchData = useSelector((state) => state.match);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });
      const { teamData, matchId } = await response.json();
      dispatch(teamActions.updateTeamOnly(teamData));
      router.push(`/match/${matchId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ConfirmCourt />
      <Card className="flex-1 w-full">
        <ConfirmInfo />
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <Button size="wide" onClick={handleSave}>
          確認比賽資訊
        </Button>
      </Card>
    </>
  );
};

export default Confirm;
