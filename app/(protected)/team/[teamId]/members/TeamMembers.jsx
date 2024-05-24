"use client";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { FiPlus, FiChevronRight } from "react-icons/fi";
import { BsGrid3X2Gap } from "react-icons/bs";
import { Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import TeamMembersTable from "./TeamMembersTable";

const TeamMembers = ({ teamId, className }) => {
  const { team } = useTeam(teamId);
  const { members, isLoading } = useTeamMembers(teamId);

  if (isLoading) return <>loading...</>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle onClick={() => router.push("/team/info")}>
          {team?.name || ""}
          <FiChevronRight />
        </CardTitle>
        <CardBtnGroup>
          <Link variant="ghost" size="icon" href="/team/lineup">
            <BsGrid3X2Gap />
          </Link>
        </CardBtnGroup>
      </CardHeader>
      <TeamMembersTable data={members} />
      <Link variant="secondary" size="lg" href="/team/member/new">
        <FiPlus />
        新增隊員
      </Link>
    </Card>
  );
};

export default TeamMembers;
