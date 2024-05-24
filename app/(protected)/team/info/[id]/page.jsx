import TeamInfo from "../../TeamInfo";

const TeamInfoPage = async ({ params }) => {
  const { id: teamId } = params;
  return <TeamInfo teamId={teamId} className="w-full" />;
};

export default TeamInfoPage;
