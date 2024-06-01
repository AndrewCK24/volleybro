"use client";
import { useTeamMembers } from "@/hooks/use-data";
import { FiPlus } from "react-icons/fi";
import { BsGrid3X2Gap } from "react-icons/bs";
import { Link } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TeamMembersTable from "./table";

const TeamMembers = ({ teamId, className }) => {
  const { members, isLoading } = useTeamMembers(teamId);

  if (isLoading) return <>loading...</>;

  return (
    <Card className={className}>
      <div className="grid grid-cols-2 gap-2">
        <Link variant="secondary" size="lg" href={`/team/${teamId}/lineup`}>
          <BsGrid3X2Gap />
          編輯陣容
        </Link>
        <Link variant="secondary" size="lg" href={`/team/${teamId}/members/new`}>
          <FiPlus />
          新增隊員
        </Link>
      </div>
      <TeamMembersTable data={members} teamId={teamId} />
    </Card>
  );
};

export default TeamMembers;
