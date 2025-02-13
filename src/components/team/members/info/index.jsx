"use client";
import Image from "next/image";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { RiUserLine } from "react-icons/ri";
import { Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import MembersInfoTable from "@/components/team/members/info/table";
import AccessConfig from "@/components/team/members/access-config";
import LoadingCard from "@/components/custom/loading/card";

const MembersInfo = ({ teamId, memberId, className }) => {
  const { team } = useTeam(teamId);
  const { members } = useTeamMembers(teamId);
  const member = members?.find((member) => member._id === memberId) || {};
  const isAdmin = true;
  // TODO: 更新 admin 資料結構

  if (!team || !members) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <CardHeader className="h-fit">
        {member?.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <RiUserLine className="size-16 rounded-full text-muted-foreground" />
        )}
        <CardTitle>{member.name}</CardTitle>
        {isAdmin && (
          <CardBtnGroup>
            <Link
              variant="link"
              size="lg"
              href={`/team/${teamId}/members/${memberId}/edit`}
            >
              編輯
            </Link>
          </CardBtnGroup>
        )}
      </CardHeader>
      <MembersInfoTable team={team} member={member} />
      <AccessConfig teamId={teamId} memberId={memberId} />
    </Card>
  );
};

export default MembersInfo;
