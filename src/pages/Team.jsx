import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

import store from "../store/store";

const Container = styled.div`
  flex: 1 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: nowrap;
  overflow: scroll;
  overscroll-behavior-x: none;
`;

export const Title = styled.h1`
  width: 100%;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-800);
`;

const TeamPage = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default TeamPage;

export const loader = async () => {
  const defaultTeam = store.getState().user.teamIds[0];
  const viewingTeam = store.getState().team._id;
  
};
