"use client";
import { useRouter } from "next/navigation";
import { useUserTeams } from "@/hooks/use-data";
import { FiUsers, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Button, Link } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Invitations = () => {
  const router = useRouter();
  const { teams, isLoading } = useUserTeams();

  const handleAccept = async (teamId) => {
    try {
      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const { userData, teamData, membersData } = await response.json();
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      router.push("/team");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
              onClick={() => handleAccept(team._id)}
            >
              <FiCheck />
            </Button>
          </ListItem>
        ))
      )}
      <Separator />
      <CardDescription className="text-center">
        沒有找到你的隊伍嗎？你可以...
      </CardDescription>
      <Link size="lg" href="/team/new">
        <FiPlus />
        建立隊伍
      </Link>
      <CardDescription className="text-center">
        或聯絡你的隊伍管理者
      </CardDescription>
    </>
  );
};

export default Invitations;
