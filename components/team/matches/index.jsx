import { Card } from "@/components/ui/card";
import TeamMatchesTable from "@/components/team/matches/table";

const TeamMatches = ({ teamId, className }) => {
  return (
    <Card className={className}>
      <TeamMatchesTable teamId={teamId} />
    </Card>
  );
};

export default TeamMatches;
