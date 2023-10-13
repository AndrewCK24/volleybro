import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store";
import { teamActions } from "../components/team/team-slice";
import {
  List,
  ListHeader,
  ListInfo,
  ListTitle,
  ListItem,
  LinkButton,
} from "../components/common/List";
import MemberCard from "../components/team/MemberCard";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FiPlus, FiChevronRight } from "react-icons/fi";

const StyledItem = styled(ListItem)`
  padding: 0.5rem 1.5rem;
  color: var(--color-danger-500);
  font-size: 1.25rem;
  font-weight: 600;
`;

const TeamMembersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id: userId } = useSelector((state) => state.user);
  const {
    _id: teamId,
    name,
    members,
    editingMember,
  } = useSelector((state) => state.team);
  const isAdmin = members.find(
    (member) => member.info.userId === userId && member.info.admin
  );
  const isNewBtnVisible = !isAdmin
    ? false
    : editingMember
    ? false
    : members[members.length - 1]._id
    ? true
    : false;
  const hasSixPlayers =
    members.filter((member) => member.number && member.role !== "M").length >=
    6;

  const handleTeamBtn = () => {
    navigate(`/team/${teamId}`);
  };

  const handleCreateMember = () => {
    dispatch(teamActions.createMember());
  };

  return (
    <List>
      <ListHeader>
        <ListInfo>
          <ListTitle onClick={() => handleTeamBtn()}>
            {name}
            <FiChevronRight />
          </ListTitle>
        </ListInfo>
        <LinkButton to="/team/lineup">
          <BsGrid3X2Gap />
        </LinkButton>
      </ListHeader>
      {hasSixPlayers || <StyledItem>*球員不足6人，請先完成球員登錄</StyledItem>}
      {members.map((member, index) => (
        <MemberCard
          key={index}
          index={index}
          member={member}
          isAdmin={isAdmin}
          userId={userId}
        />
      ))}
      {isNewBtnVisible && (
        <ListItem
          className="icon-button secondary"
          onClick={() => handleCreateMember()}
        >
          <FiPlus />
        </ListItem>
      )}
    </List>
  );
};

export default TeamMembersPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊員名單" });
  return null;
};
