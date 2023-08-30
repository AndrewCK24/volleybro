import { Form, Link } from "react-router-dom";
import styled from "@emotion/styled";

export const StyledForm = styled(Form)`
  flex: 0.8 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: right;
  justify-content: center;
  gap: 0.5rem;
`;

export const StyledLabel = styled.label`
  width: 100%;
  padding: 0.5rem 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

export const StyledInput = styled.input`
  height: 2.5rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--gray-primary);
  font-size: 1.5rem;
  font-weight: 500;
  &:focus {
    outline: none;
    -webkit-box-shadow:inset 0 0 0.25rem var(--color-primary-400);
       -moz-box-shadow:inset 0 0 0.25rem var(--color-primary-400);
            box-shadow:inset 0 0 0.25rem var(--color-primary-400);
  }
`;

export const StyledButton = styled.button`
  height: 2.5rem;
  width: 100%;
  padding: 0.5rem;
  color: var(--color-primary-100);
  background-color: var(--color-secondary-500);
  border: none;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const StyledLink = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  color: var(--color-secondary-500);
  padding: 0.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
`;