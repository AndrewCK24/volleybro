"use client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const {
    _id: teamId,
    name: teamName,
    members,
  } = useSelector((state) => state.team);

  return (
    <Section>
      <ListHeader>
        <ListTitle onClick={() => router.push("/team/info")}>
          {teamName}
          <FiChevronRight />
        </ListTitle>
        <ListBtnContainer>
          <ListBtn onClick={() => router.push("/team/lineup")}>
            <BsGrid3X2Gap />
          </ListBtn>
        </ListBtnContainer>
      </ListHeader>
      {members.map((member) => (
        <ListItem
          key={member._id}
          onClick={() => router.push(`/team/member/${member._id}`)}
        >
          <FiUser />
          <ListItemText minimized={true} bold={true}>
            {member.number || "??"}
          </ListItemText>
          <ListItemText>{member.name}</ListItemText>
          <ListIndicator member={member} />
        </ListItem>
      ))}
      <ListItem
        type="secondary"
        center={true}
        onClick={() => router.push("/team/member/new")}
      >
        <FiPlus />
      </ListItem>
    </Section>
  );
};

export default TeamMembers;
