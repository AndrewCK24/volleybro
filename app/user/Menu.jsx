"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import store from "../store/store";
import { userActions } from "./user-slice";
import { teamActions } from "../team/team-slice";

import {
  FiChevronDown,
  FiChevronRight,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";
import { Section } from "../components/common/Section";
import { ListItem, ListItemContent } from "../components/common/List";

const ExtendTeamsIcon = styled(FiChevronDown)`
  transition: transform 0.2s ease-in-out;
  &.up {
    transform: rotate(180deg);
  }
`;

const TeamItem = styled(ListItem)`
  padding: 0 1rem;
  box-shadow: none;
  color: var(--secondary-800);

  &.special {
    color: var(--danger-600);
  }
`;

const Menu = () => {
  const [extendTeams, setExtendTeams] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name);
  const { teams } = useSelector((state) => state.user);
  // TODO: 以 ListItemDetailContent 呈現隊伍名稱與 nickname

  const handleExtendTeams = () => setExtendTeams(!extendTeams);

  const handleTeamSwitch = async (index, teamId) => {
    if (index === 0) {
      router.push("/team");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/fetch-team-by-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ teamId }),
      });
      const { status, userData, teamData } = await response.json();
      if (status === 200) {
        router.push("/team");
        dispatch(userActions.setUser(userData));
        // dispatch(teamActions.loadTeamData(teamData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvitingTeams = () => {
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
        <ListItem className="primary" onClick={() => handleExtendTeams()}>
          <FiUser />
          <ListItemContent className="extend">{userName}</ListItemContent>
          <ExtendTeamsIcon className={extendTeams && "up"} />
        </ListItem>
        {/* {extendTeams &&
          teams.map((team, index) => (
            <TeamItem key={team._id} onClick={() => handleTeamSwitch(index, team._id)}>
              <FiUsers />
              <ListItemContent className="extend">{team.name}</ListItemContent>
              {index === 0 || <GoArrowSwitch />}
            </TeamItem>
          ))} */}
        <TeamItem className="special" onClick={() => handleInvitingTeams()}>
          <ListItemContent className="extend">隊伍邀請</ListItemContent>
          <FiChevronRight />
        </TeamItem>
        <ListItem>
          <FiSettings />
          設定
        </ListItem>
      </Section>
      <Section className="transparent">
        <ListItem className="button danger" onClick={() => handleSignOut()}>
          登出
        </ListItem>
      </Section>
    </>
  );
};

export default Menu;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "功能表" });
  return null;
};
