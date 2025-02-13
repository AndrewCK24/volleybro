import { auth } from "@/auth";
import { GuidesForNewUser } from "@/components/custom/guides/new-user";
import { TeamMatches } from "@/components/home/matches";

const Home = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const { user } = session;
  const defaultTeamId = user?.teams?.joined[0];

  if (!defaultTeamId) return <GuidesForNewUser />;

  return <TeamMatches teamId={defaultTeamId} />;
};

export default Home;
