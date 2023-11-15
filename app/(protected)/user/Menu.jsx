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
  FiCheck,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";
import { Section, SectionHr } from "../../components/common/Section";
import { ListItem, ListItemText, ListBtn } from "../../components/common/List";

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
      const response = await fetch(`/api/teams/${team._id}`, {
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

  const handleAccept = async (teamId, accept) => {
    if (!window.confirm(accept ? "確認接受邀請？" : "確認拒絕邀請？")) return;
    try {
      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, accept }),
      });
      if (accept) {
        const { userData, teamData, membersData } = await response.json();
        dispatch(userActions.setUser(userData));
        dispatch(teamActions.setTeam({ userData, teamData, membersData }));
        router.push("/team");
      } else {
        const { userData } = await response.json();
        dispatch(userActions.setUser(userData));
        const detailRes = await fetch("/api/teams");
        const teams = await detailRes.json();
        dispatch(userActions.setTeamsDetails(teams));
      }
    } catch (error) {
      console.log(error);
    }
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
        <ListItem type="primary">
          <FiUser />
          <ListItemText>{userName}</ListItemText>
        </ListItem>
        <ListItem onClick={() => handleExtendTeams()}>
          <FiUserPlus />
          <ListItemText>隊伍與邀請</ListItemText>
          <ListItemText minimized>{invitingTeams.length}</ListItemText>
          <ExtendTeamsIcon className={extendTeams && "up"} />
        </ListItem>
        {extendTeams && (
          <>
            {joinedTeams.length > 0 && <SectionHr content="已加入隊伍" />}
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
            {invitingTeams.length > 0 && <SectionHr content="收到的邀請" />}
            {invitingTeams.map((team, index) => (
              <ListItem key={index} type="primary" text div>
                <FiUsers />
                <ListItemText>{team.name || ""}</ListItemText>
                {/* <ListBtn
                  type="primary"
                  onClick={() => window.confirm("確認接受邀請？")}
                > */}
                <ListBtn
                  type="primary"
                  onClick={() => handleAccept(team._id, true)}
                >
                  <FiCheck />
                </ListBtn>
                <ListBtn
                  type="danger"
                  onClick={() => handleAccept(team._id, false)}
                >
                  <FiX />
                </ListBtn>
              </ListItem>
            ))}
            <span>沒有你的隊伍嗎？你可以聯絡你的隊伍管理者，或...</span>
            <ListItem
              type="danger"
              text
              onClick={() => router.push("/team/new")}
            >
              <FiPlus />
              建立隊伍
            </ListItem>
          </>
        )}
        <ListItem>
          <FiSettings />
          設定
        </ListItem>
      </Section>
      <Section type="transparent">
        <ListItem type="danger" center={true} onClick={handleSignOut}>
          <FiLogOut />
          登出
        </ListItem>
      </Section>
    </>
  );
};

export default Menu;
