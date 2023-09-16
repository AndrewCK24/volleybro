import { useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { teamActions } from "./team-slice";
import { CardContainer } from "./MemberCard";
import { AiOutlinePlus } from "react-icons/ai";

const StyledContainer = styled(CardContainer)`
  padding: 0;
  svg {
    color: var(--color-secondary-100);
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const StyledBtn = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-secondary-400);
  cursor: pointer;
`;

const NewMemberBtn = () => {
  const dispatch = useDispatch();

  const btnHandler = () => {
    dispatch(teamActions.createMember());
  };

  return (
    <StyledContainer>
      <StyledBtn onClick={() => btnHandler()}>
        <AiOutlinePlus />
      </StyledBtn>
    </StyledContainer>
  );
};

export default NewMemberBtn;
