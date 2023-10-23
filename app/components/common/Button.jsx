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
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  aspect-ratio: 1;
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-secondary-500);
  }

  &:hover,
  &:active {
    svg {
      color: var(--color-secondary-300);
    }
  }

  &.secondary {
    svg {
      color: var(--color-primary-400);
    }
    &:hover,
    &:active {
      svg {
        color: var(--color-primary-200);
      }
    }
  }

  &.danger {
    svg {
      color: var(--color-danger-500);
    }
    &:hover,
    &:active {
      svg {
        color: var(--color-danger-300);
      }
    }
  }
`;

export const IconButton = ({ children, className, ...prop }) => {
  const StyledButton = styled.button`
    ${iconSharedStyle}
  `;

  return (
    <StyledButton className={className} {...prop}>
      {children}
    </StyledButton>
  );
};
