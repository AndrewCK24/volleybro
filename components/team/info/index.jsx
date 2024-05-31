"use client";
import { useTeam } from "@/hooks/use-data";
import { Card } from "@/components/ui/card";
import TeamInfoTable from "@/components/team/info/table";
import LoadingCard from "@/components/custom/loading/card";

const TeamInfo = ({ teamId, className }) => {
  const { team, isLoading } = useTeam(teamId);

  if (isLoading) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <TeamInfoTable team={team} />
    </Card>
  );
};

export default TeamInfo;
