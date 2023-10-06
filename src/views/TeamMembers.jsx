import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import store from "../store";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  LinkSet,
  ListItemContainer,
  LinkButton,
} from "../components/common/List";
import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";

const StyledItem = styled(ListItemContainer)`
  padding: 0.5rem 1.5rem;
  color: var(--color-danger-500);
  font-size: 1.25rem;
  font-weight: 600;
`;

const TeamMembersPage = () => {
  const { name, members, editingMember } = useSelector((state) => state.team);
  const isNewBtnVisible = editingMember
    ? false
    : members[members.length - 1]._id
    ? true
    : false;
  const hasSixPlayers =
    members.filter((member) => member.number && member.role !== "M")
      .length >= 6;

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>
          {name}
          <LinkButton to="/team/list">
            <GoArrowSwitch />
          </LinkButton>
        </ListTitle>
        <LinkSet>
          <LinkButton to="/team/list">
            <BsGrid3X2Gap />
          </LinkButton>
          <LinkButton to="/team/new">
            <FiEdit3 />
          </LinkButton>
        </LinkSet>
      </ListHeader>
      {hasSixPlayers || <StyledItem>*球員不足6人，請先完成球員登錄</StyledItem>}
      {members.map((member, index) => (
        <MemberCard key={index} index={index} member={member} />
      ))}
      {isNewBtnVisible && <NewMemberBtn />}
    </ListContainer>
  );
};

export default TeamMembersPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊員名單" });
  return null;
};
