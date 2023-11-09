"use client";
import { useSelector } from "react-redux";

import { Section } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListBtnContainer,
  ListBtn,
  ListItem,
  ListItemText,
  ListIndicator,
} from "@/app/components/common/List";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FiUser, FiPlus, FiChevronRight } from "react-icons/fi";

const TeamMembers = () => {
  const {
    _id: teamId,
    name: teamName,
    members,
  } = useSelector((state) => state.team);
  return (
    <Section>
      <ListHeader>
        <ListTitle>
          {teamName}
          <FiChevronRight />
        </ListTitle>
        <ListBtnContainer>
          <ListBtn href="/team/lineup">
            <BsGrid3X2Gap />
          </ListBtn>
        </ListBtnContainer>
      </ListHeader>
      {members.map((member) => (
        <ListItem key={member._id}>
          <FiUser />
          <ListItemText minimized={true} bold={true}>
            {member.number || "??"}
          </ListItemText>
          <ListItemText>{member.name}</ListItemText>
          <ListIndicator member={member} />
        </ListItem>
      ))}
      <ListItem type="secondary" center={true}>
        <FiPlus />
      </ListItem>
    </Section>
  );
};

export default TeamMembers;
