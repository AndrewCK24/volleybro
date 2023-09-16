import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userActions } from "./user-slice";

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

const CardContainer = styled.div`
  flex: 0 0 4rem;
  width: 100%;
  background-color: var(--color-secondary-200);
  border-radius: 0.5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const StyledBtn = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  color: var(--color-danger-100);
  background-color: var(--color-danger-800);
  cursor: pointer;
`;

const MenuPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOutUser = async () => {
    try {
      await fetch("/.netlify/functions/sign-out-user");
      dispatch(userActions.signOut());
      navigate("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <CardContainer>1</CardContainer>
      <CardContainer>
        <StyledBtn onClick={() => signOutUser()}>登出</StyledBtn>
      </CardContainer>
    </Container>
  );
};

export default MenuPage;
