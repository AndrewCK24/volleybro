import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiClock as HistoryIcon,
  FiUser as UserIcon,
} from "react-icons/fi";

const Container = styled.aside`
  flex: 0 0 3rem;
  height: 100%;
  padding: 1rem 5%;
  display: flex;
  flex-direction: row;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
  background-color: var(--color-secondary-500);
  svg {
    stroke: var(--color-primary-100);
    height: 2rem;
    width: 2rem;
  }
`;

const StyledLink = styled(Link)`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

const SideNav = () => {
  return (
    <Container>
      <StyledLink to="/">
        <HomeIcon />
      </StyledLink>
      <StyledLink to="/members">
        <TeamIcon />
      </StyledLink>
      <StyledLink to="/history">
        <HistoryIcon />
      </StyledLink>
      <StyledLink to="/user">
        <UserIcon />
      </StyledLink>
    </Container>
  );
};

export default SideNav;
