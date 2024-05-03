"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { userActions } from "../user/user-slice";
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
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListItem, ListItemText } from "../../components/common/List";

const ExtendTeamsIcon = styled(FiChevronDown)`
  transition: transform 0.2s ease-in-out;
  &.up {
    transform: rotate(180deg);
  }
`;

const Menu = () => {
  const dispatch = useDispatch();
  const [extendTeams, setExtendTeams] = useState(false);
  const router = useRouter();
  const userName = useSelector((state) => state.user.name);
  const joinedTeams = useSelector((state) => state.user.teams.joined);
  const invitingTeams = useSelector((state) => state.user.teams.inviting);
  const isDetailsLoaded = joinedTeams[0]?._id || invitingTeams[0]?._id || false;
  // TODO: 以 ListItemDetailContent 呈現隊伍名稱與 nickname

  const handleExtendTeams = async () => {
    if (extendTeams) return setExtendTeams(!extendTeams);

    setExtendTeams(!extendTeams);
    if (isDetailsLoaded) return;

    const response = await fetch("/api/teams");
    const teams = await response.json();
    dispatch(userActions.setTeamsDetails(teams));
  };

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
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      router.push("/team");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button size="wide">
        <FiUser />
        <ListItemText>{userName}</ListItemText>
      </Button>
      <ListItem onClick={() => handleExtendTeams()}>
        <FiUserPlus />
        <ListItemText>隊伍與邀請</ListItemText>
        <ListItemText minimized>{invitingTeams.length}</ListItemText>
        <ExtendTeamsIcon className={extendTeams && "up"} />
      </ListItem>
      {extendTeams && (
        <>
          {joinedTeams.length > 0 && (
            <CardDescription>已加入隊伍</CardDescription>
          )}
          {joinedTeams.map((team, index) => (
            <ListItem
              key={index}
              type="primary"
              text
              onClick={() => handleTeamSwitch(index, team)}
            >
              <FiUsers />
              <ListItemText>{team.name || ""}</ListItemText>
              {index !== 0 && <GoArrowSwitch />}
            </ListItem>
          ))}
          {invitingTeams.length > 0 && (
            <>
              <Separator />
              <CardDescription>收到的邀請</CardDescription>
            </>
          )}
          {invitingTeams.map((team, index) => (
            <ListItem
              key={index}
              type="primary"
              text
              onClick={() => router.push(`/team/info/${team._id}`)}
            >
              <FiUsers />
              <ListItemText>{team.name || ""}</ListItemText>
            </ListItem>
          ))}
          <CardDescription>
            沒有你的隊伍嗎？你可以聯絡你的隊伍管理者，或...
          </CardDescription>
          <Link variant="ghost" size="lg" href="/team/invitations">
            <FiPlus />
            查看更多
          </Link>
        </>
      )}
      <ListItem>
        <FiSettings />
        設定
      </ListItem>
    </>
  );
};

export default Menu;
