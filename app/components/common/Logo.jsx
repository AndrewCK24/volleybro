import styled from "styled-components";

const Container = styled.div`
  flex: 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-family: "Orbitron";
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary-500);
  text-shadow: 0 0 0.25rem var(--color-secondary-600);
  /* TODO: 加上動畫效果: https://youtu.be/1EAtn4B-76g */
  /* &.dark {
    color: var(--color-secondary-800);
    border: none;
    text-shadow: none;
    box-shadow: none;
  }
  &.small {
    padding: 0.5rem;
    border: none;
    text-shadow: none;
    box-shadow: none;
    font-size: 2rem;
  } */
`;

const Logo = () => <Container>V-STATS</Container>;

export default Logo;
