"use client";
import { useRouter } from "next/navigation";
import { useUserTeams } from "@/hooks/use-data";
import { FiUsers, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Button, Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Invitations = ({ className }) => {
  const router = useRouter();
  const { teams, isLoading } = useUserTeams();

  const handleAccept = async (teamId, accept) => {
    if (!window.confirm(accept ? "確認接受邀請？" : "確認拒絕邀請？")) return;
    try {
      const response = await fetch("/api/users/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, accept }),
      });
      const userTeams = await response.json();
      mutate({ ...user, teams: userTeams });

      return router.push(accept ? "/team" : "/user/invitations");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>隊伍邀請</CardTitle>
      </CardHeader>
      {isLoading ? (
        <>loading...</>
      ) : (
        teams.inviting.map((team) => (
          <ListItem div key={team._id}>
            <FiUsers />
            <ListItemText>{team.name}</ListItemText>
            <Button
              variant="link"
              size="icon"
              onClick={() => handleAccept(team._id, true)}
            >
              <FiCheck />
            </Button>
            <Button
              variant="link"
              size="icon"
              onClick={() => handleAccept(team._id, false)}
            >
              <FiX />
            </Button>
          </ListItem>
        ))
      )}
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
