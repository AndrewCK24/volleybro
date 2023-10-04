import { Link } from "react-router-dom";
import styled from "@emotion/styled";

export const ListContainer = styled.section`
  flex: 0 0;
  width: 100%;
  border-radius: 1.5rem;
  padding: 1rem;
  background-color: var(--color-secondary-300);
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
  gap: 1rem;
`;

export const ListTitle = styled.h2`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 3rem;
  margin: 0;
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
  background-color: var(--color-primary-200);
  border-radius: 1rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1.5rem;
`;
