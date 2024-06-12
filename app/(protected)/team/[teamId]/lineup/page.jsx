"use client";
import { useToast } from "@/components/ui/use-toast";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import Lineup from "@/components/team/lineup";

const LineupPage = ({ params }) => {
  const { toast } = useToast();
  const { teamId } = params;
  const { team, mutate } = useTeam(teamId);
  const { members } = useTeamMembers(teamId);

  const handleSave = async (lineups) => {
    try {
      const response = await fetch(`/api/teams/${team._id}/lineups`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lineups),
      });
      const data = await response.json();
      mutate({ ...team, lineups: data }, false);
      return toast({
        title: "儲存成功",
        description: "已成功儲存陣容設定。",
      });
    } catch (error) {
      console.log(error);
    }
    // if (isRecording) {
    //   dispatch(matchActions.configMatchSet({ firstServe, lineup }));
    //   router.push(`/match/${matchId}/confirm`);
    // }
  };

  return <Lineup team={team} members={members} handleSave={handleSave} />;
};

export default LineupPage;
