import Team from "@/components/team";

const TeamPage = ({ params, searchParams }) => {
  const { teamId } = params;
  const defaultTab = searchParams?.tab || "feeds";

  return <Team teamId={teamId} tab={defaultTab} />;
};

export default TeamPage;
