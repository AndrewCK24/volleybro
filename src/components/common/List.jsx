import { Link } from "react-router-dom";
import styled from "@emotion/styled";

export const ListContainer = styled.section`
  flex: 0 0;
  width: 100%;
  border-radius: 1.5rem;
  padding: 1rem;
  /* background-color: var(--color-secondary-300); */
  background-color: var(--color-primary-100);
  box-shadow: 0 0 1rem var(--color-primary-300);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

export const ListHeader = styled.div`
  flex: 0 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ListTitleGroup = styled.h2`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 3rem;
  margin: 0;
`;

export const ListTitle = styled.h2`
  max-width: calc(100vw - 11rem);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-primary-800);
`;

export const LinkSet = styled.div`
  flex: 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const LinkButton = styled(Link)`
  flex: 0 0 3rem;
  height: 3rem;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  aspect-ratio: 1;
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-secondary-700);
  }
`;

export const ListItemContainer = styled.div`
  flex: 0 0 4rem;
  width: 100%;
  /* background-color: var(--color-primary-200); */
  background-color: var(--color-primary-100);
  box-shadow: 0 0 0.5rem var(--color-primary-300);
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1.5rem;
  &.toggled {
    box-shadow: 0 0 1rem var(--color-primary-400);
  }
`;

export const ListItemContentContainer = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1.5rem;
`;

const StyledContent = styled.div`
  flex: 1 1;
  max-width: 10rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5rem;

  &.small {
    flex: 0 0 2rem;
    justify-content: flex-end;
  }
`;

export const ListItemContent = ({ children, className }) => {
  return <StyledContent className={className}>{children}</StyledContent>;
};

const StyledIndicator = styled.div`
  flex: 0 0 6.5rem;
  height: 2rem;
  padding: 0rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-secondary-600);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  color: var(--color-secondary-600);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5rem;
  gap: 0.25rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.primary {
    // joined
    background-color: var(--color-secondary-600);
    color: var(--color-primary-100);
  }

  &.secondary {
    // not invited
    border-color: var(--color-primary-400);
    background-color: var(--color-primary-400);
    color: var(--color-primary-100);
  }

  &.danger {
    // admin
    border-color: var(--color-danger-500);
    background-color: var(--color-danger-500);
    color: var(--color-primary-100);
  }
`;

export const ListIndicator = ({ children, className }) => {
  switch (className) {
    case "primary":
      return <StyledIndicator className="primary">{children}</StyledIndicator>;
    case "secondary":
      return (
        <StyledIndicator className="secondary">{children}</StyledIndicator>
      );
    case "danger":
      return <StyledIndicator className="danger">{children}</StyledIndicator>;
    default:
      return <StyledIndicator>{children}</StyledIndicator>;
  }
};
