import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border: solid 1px var(--white-primary);
  border-radius: 1.5rem;
  box-shadow: 0 0 1rem var(--white-primary);
  color: var(--white-primary);
  font-family: "Orbitron";
  font-size: 6rem;
  text-shadow: 0 0 1rem var(--white-primary);
  /* TODO: 加上動畫效果: https://youtu.be/1EAtn4B-76g */
`;

const Logo = () => <Container>V</Container>;

export default Logo;
