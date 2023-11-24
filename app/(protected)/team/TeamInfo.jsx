"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiFileText, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import { Section } from "@/app/components/common/Section";
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
  const [isEditing, setIsEditing] = useState(false);
  const invitingTeams = useSelector((state) => state.user.teams.inviting);
  const isInviting = invitingTeams.find((team) => team === teamData._id);
  const isAdmin =
    teamData._id === useSelector((state) => state.team._id)
      ? useSelector((state) => state.team.admin)
      : false;

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
              <ListItem type="primary">
                <FiCheck />
                同意邀請
              </ListItem>
              <ListItem type="danger" text>
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
