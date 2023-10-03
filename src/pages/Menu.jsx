import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userActions } from "../components/user/user-slice";
import { teamActions } from "../components/team/team-slice";

const CardContainer = styled.div`
  flex: 0 0 4rem;
  width: 100%;
  background-color: var(--color-primary-200);
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
  const userName = useSelector((state) => state.user.name);

  const signOutUser = async () => {
    try {
      await fetch("/.netlify/functions/sign-out-user");
      dispatch(userActions.signOut());
      dispatch(teamActions.resetTeamData());
      navigate("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CardContainer>{userName}</CardContainer>
      <CardContainer>
        <StyledBtn onClick={() => signOutUser()}>登出</StyledBtn>
      </CardContainer>
    </>
  );
};

export default MenuPage;
