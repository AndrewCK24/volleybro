import styled from "@emotion/styled";
import { css } from "@emotion/react";

const containedStyle = css`
  background-color: ${({ theme }) => theme.colors.secondary[4]};
  color: ${({ theme }) => theme.colors.primary[0]};
`;

const outlinedStyle = css`
  background-color: ${({ theme }) => theme.colors.primary[0]};
  color: ${({ theme }) => theme.colors.secondary[4]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[4]};
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[4] + "10"};
  }
`;

const textStyle = css`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary[4]};
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[4] + "10"};
  }
`;

const disabledStyle = css`
  cursor: not-allowed;
  &:hover, &:active {
    opacity: 1;
  }
`;

const variantMap = {
  contained: containedStyle,
  outlined: outlinedStyle,
  text: textStyle,
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 0.5rem;
  outline: none;
  min-width: 6rem;
  min-height: 2.5rem;
  cursor: pointer;
  transition: all 0.25s ease-in-out;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

const Button = (props) => {
  const { children, variant } = props;

  <StyledButton {...props}>
    <span>{children}</span>
  </StyledButton>;
};

export default Button;