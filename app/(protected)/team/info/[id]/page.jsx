import { Card } from "@/components/ui/card";
import TeamInfo from "../../TeamInfo";

const getTeamData = async (teamId) => {
  const response = await fetch(process.env.URL + `/api/teams/${teamId}`);
  const { teamData, membersData } = await response.json();
  return { teamData, membersData };
};

const TeamInfoPage = async ({ params }) => {
  const { id: teamId } = params;
  const { teamData, membersData } = await getTeamData(teamId);
  return (
    <Card className="w-full">
      <TeamInfo teamData={teamData} membersData={membersData} />
    </Card>
  );
};

export default TeamInfoPage;
