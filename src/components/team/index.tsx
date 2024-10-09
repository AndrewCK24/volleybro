import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamHero from "@/components/team/hero";
import ConfirmInvitation from "@/components/team/confirmation";
import TeamFeeds from "@/components/team/feeds";
import TeamInfo from "@/components/team/info";
import TeamMembers from "@/components/team/members";

const Team = ({ teamId, tab }: { teamId: string; tab: string }) => {
  return (
    <>
      <ConfirmInvitation teamId={teamId} />
      <TeamHero teamId={teamId} />
      <Tabs defaultValue={tab} className="relative w-full">
        <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3">
          <TabsTrigger value="feeds">動態</TabsTrigger>
          <TabsTrigger value="about">關於</TabsTrigger>
          <TabsTrigger value="members">成員</TabsTrigger>
        </TabsList>
        <TabsContent value="feeds">
          <TeamFeeds teamId={teamId} />
        </TabsContent>
        <TabsContent value="about">
          <TeamInfo teamId={teamId} />
        </TabsContent>
        <TabsContent value="members">
          <TeamMembers teamId={teamId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Team;
