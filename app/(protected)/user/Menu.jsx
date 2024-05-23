"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { useUserTeams } from "@/hooks/use-data";
import { teamActions } from "../team/team-slice";
import {
  FiChevronDown,
  FiSettings,
  FiUser,
  FiUsers,
  FiUserPlus,
  FiPlus,
} from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";
import { Button, Link } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Menu = ({ className }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [extendTeams, setExtendTeams] = useState(false);
  const { data, update } = useSession();
  const user = data?.user || null;
  const { teams, isLoading: isUserTeamsLoading } = useUserTeams();

  const handleTeamSwitch = async (index, team) => {
    if (index === 0) return router.push("/team");

    try {
      const response = await fetch(`/api/teams/${team._id}?switch=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const { userData, teamData, membersData } = await response.json();
      await update({
        ...data,
        user: { ...data.user, ...userData },
      });
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      router.push("/team");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={className}>
      <Button size="wide">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <FiUser />
        )}
        {user?.name || ""}
      </Button>
      <Button
        variant="outline"
        size="wide"
        onClick={() => setExtendTeams(!extendTeams)}
      >
        <FiUserPlus />
        <span className="flex justify-start flex-1">隊伍與邀請</span>
        {teams && teams.inviting.length}
        <FiChevronDown
          className={`transition-transform duration-200 ${
            extendTeams ? "rotate-180" : ""
          }`}
        />
      </Button>
      {extendTeams &&
        (isUserTeamsLoading ? (
          <>loading...</>
        ) : (
          <>
            {teams.joined.length > 0 && (
              <CardDescription>已加入隊伍</CardDescription>
            )}
            {teams.joined.map((team, index) => (
              <Button
                key={team._id}
                variant="ghost"
                size="wide"
                onClick={() => handleTeamSwitch(index, team)}
              >
                <FiUsers />
                {team.name || ""}
                {index !== 0 && <GoArrowSwitch />}
              </Button>
            ))}
            {teams.inviting.length > 0 && (
              <>
                <Separator />
                <CardDescription>收到的邀請</CardDescription>
              </>
            )}
            {teams.inviting.map((team) => (
              <Button
                key={team._id}
                variant="ghost"
                size="wide"
                onClick={() => router.push(`/team/info/${team._id}`)}
              >
                <FiUsers />
                {team.name || ""}
              </Button>
            ))}
            <CardDescription>
              沒有你的隊伍嗎？你可以聯絡你的隊伍管理者，或...
            </CardDescription>
            <Link variant="ghost" size="lg" href="/user/invitations">
              <FiPlus />
              查看更多
            </Link>
          </>
        ))}
      <Button variant="outline" size="wide">
        <FiSettings />
        設定
      </Button>
    </Card>
  );
};

export default Menu;
