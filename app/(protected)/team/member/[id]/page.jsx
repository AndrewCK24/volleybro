"use client";
import { useState } from "react";
import { useSelector } from "react-redux";

import { FiEdit2 } from "react-icons/fi";
import { Section, SectionHr } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListBtnContainer,
  ListBtn,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";
import MemberForm from "../MemberForm";

const MemberPage = ({ params }) => {
  const { id } = params;
  const [isEditing, setIsEditing] = useState(false);
  const { members } = useSelector((state) => state.team);
  const member = members.find((member) => member._id === id);

  const handleEdit = () => setIsEditing(true);

  return (
    <Section>
      <ListHeader>
        <ListTitle>隊員詳細資料</ListTitle>
        <ListBtnContainer>
          {!isEditing && (
            <ListBtn onClick={handleEdit}>
              <FiEdit2 />
            </ListBtn>
          )}
        </ListBtnContainer>
      </ListHeader>
      {isEditing ? (
        <MemberForm member={member} setIsEditing={setIsEditing} />
      ) : (
        <>
          <ListItem type="secondary" text>
            <ListItemText bold>背號：{member.number || " "}</ListItemText>
          </ListItem>
          <ListItem type="secondary" text>
            <ListItemText bold>姓名：{member.name}</ListItemText>
          </ListItem>
          <SectionHr content="權限與邀請" />
          <ListItem type="secondary" text>
            <ListItemText>信箱：{member.meta.email}</ListItemText>
          </ListItem>
          <ListItem type="secondary" text>
            <ListItemText>
              權限：{member.meta.admin ? "管理者" : "一般成員"}
            </ListItemText>
          </ListItem>
        </>
      )}
    </Section>
  );
};

export default MemberPage;
