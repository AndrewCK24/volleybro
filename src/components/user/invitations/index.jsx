"use client";
import { useRouter } from "next/navigation";
import { useUser, useUserTeams } from "@/src/hooks/use-data";
import { FiUsers, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Link } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/components/ui/table";

const Invitations = ({ className }) => {
  const router = useRouter();
  const { user, mutate: mutateUser } = useUser();
  const { teams, isLoading, mutate: mutateUserTeams } = useUserTeams();

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
      mutateUser({ ...user, teams: userTeams }, false);

      return accept ? router.push(`/team/${teamId}`) : null;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>隊伍邀請</CardTitle>
      </CardHeader>
      <Table>
        <TableBody className="text-xl">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : (
            teams.inviting.map((team) => (
              <TableRow key={team._id}>
                <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                  <FiUsers />
                </TableCell>
                <TableCell onClick={() => router.push(`/team/${team._id}`)}>
                  {team.name}
                </TableCell>
                <TableCell
                  className="w-6 [&>svg]:w-6 [&>svg]:h-6 text-primary"
                  onClick={() => handleAccept(team._id, true)}
                >
                  <FiCheck />
                </TableCell>
                <TableCell
                  className="w-6 [&>svg]:w-6 [&>svg]:h-6 text-destructive"
                  onClick={() => handleAccept(team._id, false)}
                >
                  <FiX />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Separator content="沒有找到你的隊伍嗎？你可以..." />
      <Link size="lg" href="/team/new">
        <FiPlus />
        建立隊伍
      </Link>
      <CardDescription className="text-center">
        或聯絡你的隊伍管理者
      </CardDescription>
    </Card>
  );
};

export default Invitations;
