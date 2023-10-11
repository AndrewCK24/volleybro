import { NavLink } from "react-router-dom";
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
`;

const NavBtn = styled(NavLink)`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-primary-200);
  font-size: 1.25rem;
  gap: 0.5rem;

  svg {
    stroke: var(--color-primary-200);
    height: 2rem;
    width: 2rem;
  }

  transition: color 0.2s ease-in-out;

  &.active {
    color: var(--color-primary-100);
    font-weight: 700;
    svg {
      stroke: var(--color-primary-100);
    }
  }
`;

const BottomNav = () => {
  return (
    <Container>
      <NavBtn to="/">
        <HomeIcon />首頁
      </NavBtn>
      <NavBtn to="/team">
        <TeamIcon />隊伍
      </NavBtn>
      <NavBtn to="/history">
        <HistoryIcon />紀錄
      </NavBtn>
      <NavBtn to="/user">
        <MenuIcon />選項
      </NavBtn>
    </Container>
  );
};

export default BottomNav;
