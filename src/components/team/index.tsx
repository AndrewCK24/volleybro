import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamHero from "@/components/team/hero";
import ConfirmInvitation from "@/components/team/confirmation";
import TeamInfo from "@/components/team/info";
import TeamMembers from "@/components/team/members";

const Team = ({ teamId, tab }: { teamId: string; tab: string }) => {
  const defaultTab = tab || "members";

  return (
    <>
      <ConfirmInvitation teamId={teamId} />
      <TeamHero teamId={teamId} />
      <Tabs defaultValue={defaultTab} className="relative w-full">
        <TabsList className="sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger value="members">成員</TabsTrigger>
          <TabsTrigger value="about">關於</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <TeamMembers teamId={teamId} />
        </TabsContent>
        <TabsContent value="about">
          <TeamInfo teamId={teamId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Team;
