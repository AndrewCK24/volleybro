"use client";
import { useRouter } from "next/navigation";
import { useUser, useTeam, useUserTeams } from "@/hooks/use-data";
import { FiUsers, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import TeamInfoTable from "@/app/(protected)/team/info/TeamInfoTable";

const TeamInfo = ({ teamId, className }) => {
  const router = useRouter();
  const { user, mutate: mutateUser } = useUser();
  const { mutate: mutateUserTeams } = useUserTeams();
  const { team, isLoading } = useTeam(teamId);
  const isInviting = user?.teams.inviting.find((team) => team === teamId);
  // TODO: 更新 admin 資料結構
  const isAdmin = team?.admins
    ? team?.admins.find((admin) => admin.user_id === user?._id)
    : false;

  const handleAccept = async (teamId, accept) => {
    if (!window.confirm(accept ? "確認接受邀請？" : "確認拒絕邀請？")) return;
    const action = accept ? "accept" : "reject";
    try {
      const response = await fetch(
        `/api/users/teams?action=${action}&teamId=${teamId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const userTeams = await response.json();
      mutateUserTeams();
      mutateUser({ ...user, teams: userTeams });

      return router.push(accept ? "/team" : "/user/invitations");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <FiUsers />
          {isLoading ? "Loading..." : team?.name}
        </CardTitle>
        <CardBtnGroup>
          {isAdmin && (
            <Button
              variant="link"
              size="lg"
              onClick={() => router.push(`/team/info/${teamId}/edit`)}
            >
              <FiEdit2 />
              編輯隊伍
            </Button>
          )}
        </CardBtnGroup>
      </CardHeader>
      {isLoading ? <>Loading...</> : <TeamInfoTable team={team} />}
      {isInviting && (
        <>
          <p>是否接受此隊伍邀請？</p>
          <Button size="lg" onClick={() => handleAccept(teamId, true)}>
            <FiCheck />
            同意邀請
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => handleAccept(teamId, false)}
          >
            <FiX />
            拒絕邀請
          </Button>
        </>
      )}
    </Card>
  );
};

export default TeamInfo;
