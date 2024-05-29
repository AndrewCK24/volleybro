"use client";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { Card } from "@/components/ui/card";
import MembersInfoTable from "@/components/team/members/info/table";

const MembersInfo = ({ teamId, memberId, className }) => {
  const { team } = useTeam(teamId);
  const { members, isLoading } = useTeamMembers(teamId);
  const member = members?.find((member) => member._id === memberId) || {};

  return (
    <Card className={className}>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <MembersInfoTable team={team} member={member} />
      )}
    </Card>
  );
};

export default MembersInfo;
