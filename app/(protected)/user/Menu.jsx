"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { userActions } from "../user/user-slice";
import { teamActions } from "../team/team-slice";
import Loading from "./loading";
import Teams from "./Teams";
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

const TeamItem = styled(ListItem)`
  padding: 0 1rem;
  box-shadow: none;
  color: var(--secondary-800);

  &.special {
    color: var(--danger-600);
  }
`;

const Menu = () => {
  console.log("Menu, render");
  const dispatch = useDispatch();
  const [extendTeams, setExtendTeams] = useState(false);
  const router = useRouter();
  const userName = useSelector((state) => state.user.name);
  // TODO: 以 ListItemDetailContent 呈現隊伍名稱與 nickname

  const handleExtendTeams = () => setExtendTeams(!extendTeams);

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
        <ListItem type="primary" onClick={() => handleExtendTeams()}>
          <FiUser />
          <ListItemText className="extend">{userName}</ListItemText>
          <ExtendTeamsIcon className={extendTeams && "up"} />
        </ListItem>
        {extendTeams && (
          <Suspense fallback={<Loading />}>
            <Teams />
          </Suspense>
        )}
        <ListItem
          type="danger"
          text={true}
          onClick={() => handleInvitingTeams()}
        >
          <ListItemText className="extend">隊伍邀請</ListItemText>
          <FiChevronRight />
        </ListItem>
        <ListItem>
          <FiSettings />
          設定
        </ListItem>
      </Section>
      <Section type="transparent">
        <ListItem className="button danger" onClick={() => handleSignOut()}>
          登出
        </ListItem>
      </Section>
    </>
  );
};

export default Menu;
