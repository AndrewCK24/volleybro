import TeamMatches from "@/components/team/matches";

const TeamMatchesPage = ({ params }) => {
  const { teamId } = params;

  return <TeamMatches teamId={teamId} className="w-full" />;
};

export default TeamMatchesPage;
