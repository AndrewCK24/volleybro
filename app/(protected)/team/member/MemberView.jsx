"use client";
import { FiHash, FiUser, FiMail, FiShield } from "react-icons/fi";
import { SectionHr } from "@/app/components/common/Section";
import {
  ListItemContainer,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const MemberView = ({ member }) => {
  console.log(member);
  return (
    <>
      <ListItemContainer>
        <ListItem type="secondary" text>
          <FiHash />
          <ListItemText bold>背號：{member.number || " "}</ListItemText>
        </ListItem>
        <ListItem type="secondary" text>
          <FiShield />
          <ListItemText bold>位置：{member?.position || " "}</ListItemText>
        </ListItem>
      </ListItemContainer>
      <ListItem type="secondary" text>
        <FiUser />
        <ListItemText bold>姓名：{member.name}</ListItemText>
      </ListItem>
      <SectionHr content="權限與邀請" />
      <ListItem type="secondary" text>
        <FiMail />
        <ListItemText>信箱：{member.meta.email}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <FiShield />
        <ListItemText>
          權限：{member.meta.admin ? "管理者" : "一般成員"}
        </ListItemText>
      </ListItem>
    </>
  );
};

export default MemberView;
