import { Form, Link } from "react-router-dom";
import styled from "styled-components";

export const FormContainer = styled(Form)`
  margin: none;
  border-radius: 1rem;
  background-color: var(--color-primary-100);
  padding: 10% 5%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;

  @media screen and (min-width: 768px) {
    margin: 20% 5%;
    width: 60%;
  }
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
  justify-content: flex-start;
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

const FormLabelGroup = styled.div`
  height: 1rem;
  display: flex;
  flex-direction: row;
`;

const FormLabel = styled.label`
  height: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: left;
  padding-left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1rem;
`;

const FormRequiredSymbol = styled.span`
  width: fit-content;
  display: inline-flex;
  color: var(--color-danger-500);
  font-size: 1rem;
  font-weight: 500;
`;

const FormHelperText = styled.span`
  /* width: 100%; */
  display: inline-flex;
  align-items: center;
  justify-content: right;
  padding: 0 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-danger-500);
`;

const FormInput = styled.input`
  height: 3rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--gray-primary);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
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
    defaultValue = "",
    placeholder = "",
    required = false,
    disabled = false,
    warn = "",
    onChange,
  } = props;

  return (
    <FormInputContainer>
      <FormLabelGroup>
        <FormLabel htmlFor={name}>
          {labelText}
          {required && <FormRequiredSymbol>*</FormRequiredSymbol>}
          <FormHelperText>{warn}</FormHelperText>
        </FormLabel>
      </FormLabelGroup>
      <FormInput
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="on"
      />
    </FormInputContainer>
  );
};

const FormRadioSet = styled.div`
  width: 100%;
  padding: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: left;
  border: none;
  gap: 0.5rem;
`;

const FormRadioGroup = styled.div`
  flex: 1 1 3rem;
`;

const FormRadioInput = styled.input`
  display: none;
  &:disabled ~ label {
    border-color: var(--color-primary-500);
    color: var(--color-primary-500);
  }
  &:checked ~ label {
    background-color: var(--color-secondary-600);
    color: var(--color-primary-100);
  }
  &:checked:disabled ~ label {
    background-color: var(--color-primary-500);
  }
`;

const FormRadioLabel = styled.label`
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: solid 1px var(--color-secondary-600);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  color: var(--color-secondary-600);
`;

export const FormSelect = (props) => {
  const {
    name,
    labelText,
    options = [],
    required = false,
    defaultValue = "",
    disabled = false,
    warn = "",
    onChange,
  } = props;

  return (
    <FormInputContainer>
      <FormLabelGroup>
        <FormLabel>
          {labelText}
          {required && <FormRequiredSymbol>*</FormRequiredSymbol>}
          <FormHelperText>{warn}</FormHelperText>
        </FormLabel>
      </FormLabelGroup>
      <FormRadioSet>
        {options.map((option, index) => {
          const { id, value, text } = option;
          return (
            <FormRadioGroup key={index}>
              <FormRadioInput
                key={id}
                type="radio"
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                defaultChecked={defaultValue === value}
              />
              <FormRadioLabel key={index} htmlFor={id}>
                {text}
              </FormRadioLabel>
            </FormRadioGroup>
          );
        })}
      </FormRadioSet>
    </FormInputContainer>
  );
};

export const StyledButton = styled.button`
  height: 3rem;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-100);
  background-color: var(--color-secondary-500);
  border: none;
  border-radius: 0.5rem;
  font-size: 1.5rem;
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
