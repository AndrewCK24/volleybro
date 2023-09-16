import styled from "@emotion/styled";

const Container = styled.div`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  /* aspect-ratio: 1 / 1; */
  /* border: solid 1px var(--color-secondary-100);
  border-radius: 1.5rem;
  box-shadow: 0 0 1rem var(--color-secondary-100); */
  font-family: "Orbitron";
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary-100);
  text-shadow: 0 0 1rem var(--color-secondary-100);
  /* TODO: 加上動畫效果: https://youtu.be/1EAtn4B-76g */
  /* &.dark {
    color: var(--color-primary-800);
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
