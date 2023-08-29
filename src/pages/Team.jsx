import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";

const Container = styled.div`
  flex: 1 1;
  height: 100%;
  border-radius: 1rem;
  background-color: var(--color-primary-100);
  /* padding: 1rem; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  overscroll-behavior-x: none;
`;

const MembersPage = () => {
  const members = useSelector((state) => state.team.members);

  return (
    <Container>
      {members.map((member, index) => (
        <MemberCard key={index} index={index} member={member} />
      ))}
      <NewMemberBtn
      // disabled={members.slice(-1)[0]?.isNew}
      />
    </Container>
  );
};

export default MembersPage;

export const loader = async (dispatch) => {
  dispatch(teamActions.loadMembers());
};
