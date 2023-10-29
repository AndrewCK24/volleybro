import Link from "next/link";
import styled from "styled-components";

export const FormContainer = styled.div`
  flex: 1 1;
  margin: none;
  border-radius: 1.5rem;
  background-color: var(--primary-100);
  padding: 10% 5%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  &.minimized {
    flex: 0 0;
  }

  @media screen and (min-width: 768px) {
    margin: 20% 5%;
    width: 60%;
  }
`;

export const FormTitle = styled.h1`
  width: 100%;
  padding: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 2rem;
  font-weight: 500;
  color: var(--primary-900);
`;

export const FormContents = styled.form`
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
  color: var(--danger-500);
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
  color: var(--danger-500);
`;

const FormInput = styled.input`
  height: 4rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: solid 1px var(--gray-primary);
  font-size: 2rem;
  font-weight: 500;
  line-height: 3rem;
  &:focus {
    outline: none;
    -webkit-box-shadow: inset 0 0 0.25rem var(--primary-400);
    -moz-box-shadow: inset 0 0 0.25rem var(--primary-400);
    box-shadow: inset 0 0 0.25rem var(--primary-400);
  }
  &.warn {
    border: solid 2px var(--danger-500);
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
    ref,
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
        ref={ref}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="on"
        className={warn === " " ? "" : warn ? "warn" : ""}
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
    border-color: var(--primary-500);
    color: var(--primary-500);
  }
  &:checked ~ label {
    background-color: var(--secondary-600);
    color: var(--primary-100);
  }
  &:checked:disabled ~ label {
    background-color: var(--primary-500);
  }
`;

const FormRadioLabel = styled.label`
  width: 100%;
  height: 4rem;
  padding: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: solid 1px var(--secondary-600);
  font-size: 2rem;
  font-weight: 500;
  line-height: 3rem;
  color: var(--secondary-600);
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
  height: 4rem;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-100);
  background-color: var(--secondary-500);
  border: none;
  border-radius: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  &:disabled {
    background-color: var(--secondary-300);
  }
  &.outlined {
    font-weight: 500;
    color: var(--secondary-500);
    background-color: var(--primary-100);
    border: solid 1px var(--secondary-500);
  }
  &.outlined:disabled {
    color: var(--primary-300);
    background-color: var(--primary-100);
    border: solid 1px var(--primary-300);
  }
  &.text {
    font-weight: 500;
    color: var(--secondary-500);
    background-color: transparent;
    border: none;
  }
`;

export const FormButton = ({ children, errorArr = [], className, onClick }) => {
  const hasError = errorArr.some((error) => error);

  return (
    <StyledButton
      type="submit"
      disabled={hasError}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export const FormLink = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  color: var(--secondary-500);
  padding: 0.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
`;

export const FormHr = styled.hr`
  width: 100%;
  position: relative;
  padding: 1rem 0;
  border: 0;
  font-size: 1rem;
  color: var(--primary-400);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    var(--primary-400),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    var(--primary-400),
    transparent
  );

  &::before {
    content: "${(props) => props.content}";
    position: absolute;
    padding: 0 1ch;
    line-height: 1px;
    border: solid var(--primary-400);
    border-width: 0 99vw;
    width: fit-content;
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
  }
`;

// const FormHr = styled.hr`
//   width: 100%;
//   border: 0;
//   padding-top: 1px;
//   background: linear-gradient(
//     to right,
//     transparent,
//     var(--primary-400),
//     transparent
//   );
// `;
