import styled from "@emotion/styled";
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const variantMap = {
  contained: containedStyle,
  outlined: outlinedStyle,
  text: textStyle,
};

const containedStyle = css`
  background-color: ${({ theme }) => theme.colors.primary};
`;

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