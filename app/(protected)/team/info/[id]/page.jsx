import TeamInfo from "../../TeamInfo";

const getTeamData = async (teamId) => {
  const response = await fetch(process.env.URL + `/api/teams/${teamId}`);
  const { teamData, membersData } = await response.json();
  return { teamData, membersData };
};

const TeamInfoPage = async ({ params }) => {
  const { id: teamId } = params;
  const { teamData, membersData } = await getTeamData(teamId);
  return <TeamInfo teamData={teamData} membersData={membersData} />;
};

export default TeamInfoPage;
