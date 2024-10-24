import Team from "@/components/team";

const TeamPage = async (props: {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ tab: string }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { teamId } = params;
  const defaultTab = searchParams?.tab || "feeds";

  return <Team teamId={teamId} tab={defaultTab} />;
};

export default TeamPage;
