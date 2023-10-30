import styled, { css } from "styled-components";

const StyledButtonContainer = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 1.5rem;

  &.row {
    flex-direction: row;
  }

  @media screen and (min-width: 768px) {
    flex: 0 0;
    flex-direction: column;
    justify-content: center;
  }
`;

export const ButtonContainer = ({ children, className }) => {
  switch (className) {
    case "row":
      return (
        <StyledButtonContainer className={className}>
          {children}
        </StyledButtonContainer>
      );
    default:
      return <StyledButtonContainer>{children}</StyledButtonContainer>;
  }
};

const iconSharedStyle = css`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.25rem;
  border: none;
  background-color: transparent;
  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--secondary-500);
  }

  &:hover,
  &:active {
    svg {
      color: var(--secondary-300);
    }
  }

  &.secondary {
    svg {
      color: var(--primary-400);
    }
    &:hover,
    &:active {
      svg {
        color: var(--primary-200);
      }
    }
  }

  &.danger {
    svg {
      color: var(--danger-500);
    }
    &:hover,
    &:active {
      svg {
        color: var(--danger-300);
      }
    }
  }
`;

const StyledButton = styled.button`
  ${iconSharedStyle}
`;

export const IconButton = ({ children, className, ...prop }) => {
  return (
    <StyledButton className={className} {...prop}>
      {children}
    </StyledButton>
  );
};
