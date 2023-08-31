import { Form } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  flex: 1 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: 40%;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledLabel = styled.label`
  width: 100%;
  flex: 0 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  width: 60%;
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const StyledInput = styled.input`
  flex: 5 1;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.75rem;
  font-weight: 500;
`;

const StyledButton = styled.button`
  flex: 1 1 6rem;
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  line-height: 2rem;
  font-size: 1.75rem;
  font-weight: 500;
  background-color: var(--color-secondary-400);
  color: var(--color-primary-100);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    font-weight: 700;
    background-color: var(--color-secondary-500);
  }
`;

const TeamCreatePage = () => {
  return (
    <Container>
      <StyledForm>
        <StyledLabel >
          輸入要建立的隊伍名稱
        </StyledLabel>
        <InputContainer>
          <StyledInput type="text" placeholder="隊伍名稱" />
          <StyledButton type="submit">建立</StyledButton>
        </InputContainer>
      </StyledForm>
    </Container>
  );
};

export default TeamCreatePage;
