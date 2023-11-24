"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../user/user-slice";
import { teamActions } from "../team/team-slice";
import { FiFileText, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import { Section, SectionHr } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListBtnContainer,
  ListBtn,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";
import TeamForm from "./TeamForm";

const TeamInfo = ({ teamData, membersData }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const invitingTeams = useSelector((state) => state.user.teams.inviting);
  const isInviting =
    invitingTeams.find((team) => team === teamData._id) ||
    invitingTeams.find((team) => team._id === teamData._id);
  const isDefaultTeamAdmin = useSelector((state) => state.team.admin);
  const isAdmin =
    teamData._id === useSelector((state) => state.team._id)
      ? isDefaultTeamAdmin
      : false;

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

  return (
    <>
      {isEditing ? (
        <TeamForm teamData={teamData} setIsEditing={setIsEditing} />
      ) : (
        <Section>
          <ListHeader>
            <ListTitle>
              <FiFileText />
              隊伍資訊
            </ListTitle>
            {isAdmin && (
              <ListBtnContainer>
                <ListBtn type="primary" onClick={() => setIsEditing(true)}>
                  <FiEdit2 />
                </ListBtn>
              </ListBtnContainer>
            )}
          </ListHeader>
          <ListItem type="secondary" text>
            <ListItemText fit>隊伍名稱</ListItemText>
            <ListItemText bold>{teamData.name}</ListItemText>
          </ListItem>
          <ListItem type="secondary" text>
            <ListItemText fit>隊伍簡稱</ListItemText>
            <ListItemText bold>{teamData.nickname}</ListItemText>
          </ListItem>
          <ListItem type="secondary" text>
            <ListItemText fit>隊伍人數</ListItemText>
            <ListItemText bold>{teamData.members.length}</ListItemText>
          </ListItem>
          {isInviting && (
            <>
              <SectionHr content="是否接受此隊伍邀請？" />
              <ListItem
                type="primary"
                onClick={() => handleAccept(teamData._id, true)}
              >
                <FiCheck />
                同意邀請
              </ListItem>
              <ListItem
                type="danger"
                text
                onClick={() => handleAccept(teamData._id, false)}
              >
                <FiX />
                拒絕邀請
              </ListItem>
            </>
          )}
        </Section>
      )}
    </>
  );
};

export default TeamInfo;
