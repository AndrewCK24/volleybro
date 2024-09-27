"use client";
import { useTeam } from "@/src/hooks/use-data";
import { Card } from "@/src/components/ui/card";
import TeamInfoTable from "@/src/components/team/info/table";
import LoadingCard from "@/src/components/custom/loading/card";

const TeamInfo = ({ teamId }: { teamId: string }) => {
  const { team, isLoading } = useTeam(teamId);

  if (isLoading) return <LoadingCard />;

  return (
    <Card>
      <TeamInfoTable team={team} />
    </Card>
  );
};

export default TeamInfo;
