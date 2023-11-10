"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { userActions } from "../user/user-slice";
import { teamActions } from "../team/team-slice";
import {
  FiChevronDown,
  FiChevronRight,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";
import { Section } from "../../components/common/Section";
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
  const isTeamDetailsLoaded = joinedTeams[0]._id;
  // TODO: 以 ListItemDetailContent 呈現隊伍名稱與 nickname

  const handleExtendTeams = async () => {
    if (extendTeams) return setExtendTeams(!extendTeams);

    setExtendTeams(!extendTeams);
    if (isTeamDetailsLoaded) return;

    const response = await fetch("/api/teams");
    const teams = await response.json();
    dispatch(userActions.setTeamsDetails(teams));
  };

  const handleTeamSwitch = async (index, team) => {
    if (index === 0) return router.push("/team");

    try {
      const response = await fetch(`/api/teams/${team._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const { userData, teamData, membersData } = await response.json();
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ teamData, membersData }));
      router.push("/team");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvitingTeams = async () => {
    if (isTeamDetailsLoaded) return router.push("/team/invitations");

    const response = await fetch("/api/teams");
    const teams = await response.json();
    dispatch(userActions.setTeamsDetails(teams));
    router.push("/team/invitations");
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      dispatch(userActions.signOut());
      dispatch(teamActions.resetTeam());
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Section>
        <ListItem type="primary" onClick={() => handleExtendTeams()}>
          <FiUser />
          <ListItemText>{userName}</ListItemText>
          <ExtendTeamsIcon className={extendTeams && "up"} />
        </ListItem>
        {extendTeams &&
          joinedTeams.map((team, index) => (
            <ListItem
              key={index}
              type="primary"
              text={true}
              onClick={() => handleTeamSwitch(index, team)}
            >
              <FiUsers />
              <ListItemText>{team.name || ""}</ListItemText>
              {index !== 0 && <GoArrowSwitch />}
            </ListItem>
          ))}
        <ListItem
          type="danger"
          text={true}
          onClick={() => handleInvitingTeams()}
        >
          <ListItemText>隊伍邀請</ListItemText>
          <FiChevronRight />
        </ListItem>
        <ListItem>
          <FiSettings />
          設定
        </ListItem>
      </Section>
      <Section type="transparent">
        <ListItem type="danger" center={true} onClick={handleSignOut}>
          登出
        </ListItem>
      </Section>
    </>
  );
};

export default Menu;
