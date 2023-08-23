import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  aspect-ratio: 1 / 1;
  border: solid 1px var(--white-primary);
  border-radius: 1.5rem;
  box-shadow: 0 0 1rem var(--white-primary);
  color: var(--white-primary);
  font-family: "Orbitron";
  font-size: 6rem;
  font-weight: 500;
  text-shadow: 0 0 1rem var(--white-primary);
  /* TODO: 加上動畫效果: https://youtu.be/1EAtn4B-76g */
  &.dark {
    color: var(--color-primary-900);
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
  }
`;

const Name = styled.div`
  font-size: 2rem;
  font-weight: 500;
`;

const Logo = ({ dark, small, name }) => (
  <Container className={`${dark ? "dark" : ""} ${small ? "small" : ""}`}>
    V{name && <Name>V-STATS</Name>}
  </Container>
);

export default Logo;
