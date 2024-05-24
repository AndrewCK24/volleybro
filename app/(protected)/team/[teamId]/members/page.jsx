import TeamMembers from "./TeamMembers";

const TeamPage = ({ params }) => {
  const { teamId } = params;
  return <TeamMembers teamId={teamId} className="w-full" />;
};

export default TeamPage;
