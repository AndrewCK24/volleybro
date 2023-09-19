import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiClock as HistoryIcon,
  FiMenu as MenuIcon,
} from "react-icons/fi";

const Container = styled.aside`
  flex: 0 0 4rem;
  padding: 1rem 5%;
  display: flex;
  flex-direction: row;
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
  color: var(--color-primary-100);
  font-size: 1.25rem;
  gap: 0.5rem;
`;

const BottomNav = () => {
  return (
    <Container>
      <StyledLink to="/">
        <HomeIcon />首頁
      </StyledLink>
      <StyledLink to="/team">
        <TeamIcon />隊伍
      </StyledLink>
      <StyledLink to="/history">
        <HistoryIcon />紀錄
      </StyledLink>
      <StyledLink to="/user">
        <MenuIcon />選項
      </StyledLink>
    </Container>
  );
};

export default BottomNav;
