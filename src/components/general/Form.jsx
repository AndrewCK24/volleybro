import { Form, Link } from "react-router-dom";
import styled from "@emotion/styled";

export const FormContainer = styled(Form)`
  margin: 5%;
  border-radius: 1rem;
  background-color: var(--color-primary-100);
  padding: 10% 5%;
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const FormTitle = styled.h1`
  width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-800);
`;

export const FormContents = styled.div`
  flex: 1 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 1rem;
`;

const FormInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 0.25rem;
`;

const FormLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: left;
  padding-left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
`;

const FormRequiredSymbol = styled.span`
  width: fit-content;
  display: inline-flex;
  color: var(--color-danger-500);
  font-size: 1rem;
  font-weight: 500;
`;

const FormHelperText = styled.span`
  width: 100%;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 0 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-danger-500);
`;

const FormInput = styled.input`
  height: 2.5rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--gray-primary);
  font-size: 1.5rem;
  font-weight: 500;
  &:focus {
    outline: none;
    -webkit-box-shadow: inset 0 0 0.25rem var(--color-primary-400);
    -moz-box-shadow: inset 0 0 0.25rem var(--color-primary-400);
    box-shadow: inset 0 0 0.25rem var(--color-primary-400);
  }
`;

export const FormControl = (props) => {
  const {
    name,
    labelText,
    type = "text",
    placeholder = "",
    required = false,
    warn = "",
    onChange,
  } = props;

  return (
    <FormInputContainer>
      <div>
        <FormLabel htmlFor={name}>
          {labelText}
          {required && <FormRequiredSymbol>*</FormRequiredSymbol>}
        </FormLabel>
      </div>
      <FormInput
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="on"
      />
      <FormHelperText>{warn}</FormHelperText>
    </FormInputContainer>
  );
};

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
  &:disabled {
    background-color: var(--color-secondary-300);
  }
`;

export const FormButton = (props) => {
  const { children, errorArr } = props;
  const hasError = errorArr.some((error) => error);

  return (
    <StyledButton type="submit" disabled={hasError}>
      {children}
    </StyledButton>
  );
};

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
