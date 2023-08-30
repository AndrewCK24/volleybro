import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  flex: 1 1;
  height: 100%;
  border-radius: 1rem;
  background-color: var(--color-primary-100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  overscroll-behavior-x: none;
`;

const TeamPage = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default TeamPage;

export const loader = async (dispatch) => {
  dispatch(teamActions.loadMembers());
};
