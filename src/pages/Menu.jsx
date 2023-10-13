import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store";
import { userActions } from "../components/user/user-slice";
import { teamActions } from "../components/team/team-slice";

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
  color: var(--color-secondary-800);

  &.special {
    color: var(--color-danger-600);
  }
`;

const MenuPage = () => {
  const [extendTeams, setExtendTeams] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name);
  const { teams } = useSelector((state) => state.user);
  // TODO: 以 ListItemDetailContent 呈現隊伍名稱與 nickname

  const handleExtendTeams = () => {
    setExtendTeams(!extendTeams);
  };

  const handleTeamSwitch = async (index, teamId) => {
    if (index === 0) {
      navigate("/team");
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
        navigate("/team");
        dispatch(userActions.loadUserData(userData));
        dispatch(teamActions.loadTeamData(teamData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvitingTeams = () => {
    navigate("/team/invitations");
  };

  const handleSignOut = async () => {
    try {
      await fetch("/.netlify/functions/sign-out-user");
      dispatch(userActions.signOut());
      dispatch(teamActions.resetTeamData());
      navigate("/auth");
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
        {extendTeams &&
          teams.map((team, index) => (
            <TeamItem key={team._id} onClick={() => handleTeamSwitch(index, team._id)}>
              <FiUsers />
              <ListItemContent className="extend">{team.name}</ListItemContent>
              {index === 0 || <GoArrowSwitch />}
            </TeamItem>
          ))}
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

export default MenuPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "功能表" });
  return null;
};
