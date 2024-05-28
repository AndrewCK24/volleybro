import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamHero from "@/components/team/hero";
import LatestMatch from "@/components/team/feeds/RecentMatch";
import TeamInfo from "@/components/team/info";
import TeamMembers from "@/components/team/members";

const TeamPage = ({ params, searchParams }) => {
  const { teamId } = params;
  const defaultTab = searchParams?.tab || "feeds";

  return (
    <Tabs defaultValue={defaultTab} className="relative w-full">
      <TeamHero teamId={teamId} />
      <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3">
        <TabsTrigger value="feeds">動態</TabsTrigger>
        <TabsTrigger value="about">關於</TabsTrigger>
        <TabsTrigger value="members">成員</TabsTrigger>
      </TabsList>
      <TabsContent value="feeds">
        <LatestMatch teamId={teamId} />
      </TabsContent>
      <TabsContent value="about">
        <TeamInfo teamId={teamId} />
      </TabsContent>
      <TabsContent value="members">
        <TeamMembers teamId={teamId} />
      </TabsContent>
    </Tabs>
  );
};

export default TeamPage;
