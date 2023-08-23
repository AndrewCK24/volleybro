import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import Logo from "../general/Logo";
import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiClock as HistoryIcon,
  FiSettings as SettingIcon,
  FiUser as UserIcon,
} from "react-icons/fi";

const Container = styled.aside`
  flex: 0 0 4rem;
  height: 100%;
  padding-top: 5%;
  padding-bottom: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  svg {
    stroke: var(--white-primary);
    height: 3rem;
    width: 3rem;
    padding: 0.5rem;
  }
`;

const IconContainer = styled.div`
  height: 100%;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SideNav = () => {
  return (
    <Container>
      <IconContainer>
        <StyledLink to="/">
          <HomeIcon />
        </StyledLink>
        <StyledLink to="/team">
          <TeamIcon />
        </StyledLink>
        <StyledLink to="/record">
          <Logo small={true} />
        </StyledLink>
        <StyledLink to="/history">
          <HistoryIcon />
        </StyledLink>
        <StyledLink to="/setting">
          <SettingIcon />
        </StyledLink>
      </IconContainer>
      <UserContainer>
        <UserIcon />
      </UserContainer>
    </Container>
  );
};

export default SideNav;
