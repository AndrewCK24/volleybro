"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUserTeams } from "@/hooks/use-data";
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

const Menu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user, mutate: mutateUser } = useUser();
  const {
    teams,
    isLoading: isUserTeamsLoading,
    mutate: mutateUserTeams,
  } = useUserTeams();
  const [extendTeams, setExtendTeams] = useState(false);

  const handleTeamSwitch = async (index, team) => {
    if (index === 0) return router.push(`/team/${team._id}`);
    try {
      const response = await fetch(
        `/api/users/teams?action=switch&teamId=${team._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const userTeams = await response.json();
      mutateUser({ ...user, teams: userTeams }, false);
      mutateUserTeams();

      return router.push(`/team/${team._id}`);
    } catch (error) {
      console.log(error);
      // TODO: 錯誤提示訊息
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
        {!user ? (
          <span className="h-6 rounded-md animate-pulse bg-muted w-[16rem]" />
        ) : (
          user?.name
        )}
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
          className={cn(
            "transition-transform duration-200",
            extendTeams && "rotate-180"
          )}
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
                <span className="flex justify-start flex-1">
                  {team.name || ""}
                </span>
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
                onClick={() => router.push(`/team/${team._id}`)}
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
