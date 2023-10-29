import styled from "styled-components";

export const Section = styled.section`
  flex: 0 0;
  width: 100%;
  border-radius: 1.5rem;
  padding: 1rem;
  background-color: var(--primary-100);
  box-shadow: 0 0 1rem var(--primary-300);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;

  &.transparent {
    padding: 0 1rem;
    background-color: transparent;
    box-shadow: none;
  }

  &.fixed {
    flex: 1 1;
    overflow: scroll;
    overscroll-behavior-y: contain;
  }
`;
