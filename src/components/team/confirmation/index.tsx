"use client";
import { useRouter } from "next/navigation";
import { useUser, useUserTeams } from "@/src/hooks/use-data";
import { FiCheck, FiX, FiCheckCircle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";

const ConfirmInvitation = ({
  teamId,
  className,
}: {
  teamId: string;
  className?: string;
}) => {
  const router = useRouter();
  const { user, mutate: mutateUser } = useUser();
  const { mutate: mutateUserTeams } = useUserTeams();
  const isInviting = user?.teams.inviting.find(
    (team: string) => team === teamId
  );

  const handleAccept = async (teamId: string, accept: boolean) => {
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
      mutateUser({ ...user, teams: userTeams }, false);

      if (accept) return;

      return router.push("/user/invitations");
    } catch (error) {
      console.log(error);
    }
  };
  if (!isInviting) return null;

  return (
    <Alert className={className}>
      <FiCheckCircle />
      <AlertTitle>是否接受此隊伍邀請？</AlertTitle>
      <AlertDescription>這個隊伍想邀請您加入成為他們的成員。</AlertDescription>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => handleAccept(teamId, true)}>
          <FiCheck />
          同意邀請
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleAccept(teamId, false)}
        >
          <FiX />
          拒絕邀請
        </Button>
      </div>
    </Alert>
  );
};

export default ConfirmInvitation;
