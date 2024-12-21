"use client";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamHero from "@/components/team/hero";
import ConfirmInvitation from "@/components/team/confirmation";
import TeamInfo from "@/components/team/info";
import TeamMembers from "@/components/team/members";

const Team = ({ teamId, tab }: { teamId: string; tab: string }) => {
  const defaultTab = tab || "members";
  const { mutate: mutateTeam } = useTeam(teamId);
  const { mutate: mutateMembers } = useTeamMembers(teamId);
  const mutate = async () => {
    mutateTeam();
    mutateMembers();
  };
  usePullToRefresh(mutate);

  return (
    <div className="flex flex-col gap-2">
      <ConfirmInvitation teamId={teamId} />
      <TeamHero teamId={teamId} />
      <Tabs defaultValue={defaultTab} className="relative w-full">
        <TabsList className="grid w-full grid-cols-2">
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
    </div>
  );
};

export default Team;
