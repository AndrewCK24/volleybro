"use client";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { FiPlus } from "react-icons/fi";
import { BsGrid3X2Gap } from "react-icons/bs";
import { Link } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TeamMembersTable from "@/components/team/members/table";
import LoadingCard from "@/components/custom/loading/card";

const TeamMembers = ({ teamId, className }) => {
  const { team } = useTeam(teamId);
  const { members } = useTeamMembers(teamId);

  if (!team || !members) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <div className="grid grid-cols-2 gap-2">
        <Link variant="secondary" size="lg" href={`/team/${teamId}/lineup`}>
          <BsGrid3X2Gap />
          編輯陣容
        </Link>
        <Link
          variant="secondary"
          size="lg"
          href={`/team/${teamId}/members/new`}
        >
          <FiPlus />
          新增隊員
        </Link>
      </div>
      <TeamMembersTable team={team} members={members} teamId={teamId} />
    </Card>
  );
};

export default TeamMembers;
