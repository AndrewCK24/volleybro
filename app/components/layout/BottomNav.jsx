"use client";

import Link from "next/link";
import styled from "styled-components";

import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiClock as HistoryIcon,
  FiMenu as MenuIcon,
} from "react-icons/fi";

const Nav = styled.aside`
  flex: 0 0 4rem;
  padding: 0 5% 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--color-secondary-500);
`;

const NavLink = styled(Link)`
  flex: 1 1;
  height: 100%;
  padding: 0.5rem 0 0;
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

  transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out,
    border 0.2s ease-in-out;

  &.active {
    border-top: 0.25rem solid var(--color-primary-100);
    padding: 0.25rem 0 0;
    color: var(--color-primary-100);
    font-weight: 700;
    svg {
      stroke: var(--color-primary-100);
    }
  }
`;

const BottomNav = ({pathname}) => {
  const navLinks = [
    { title: "首頁", icon: <HomeIcon />, path: "/" },
    { title: "隊伍", icon: <TeamIcon />, path: "/team" },
    { title: "紀錄", icon: <HistoryIcon />, path: "/history" },
    { title: "選項", icon: <MenuIcon />, path: "/user" },
  ];

  return (
    <Nav>
      {navLinks.map(({ title, icon, path }) => (
        <NavLink
          key={path}
          href={path}
          className={pathname === path ? "active" : ""}
        >
          {icon}
          {title}
        </NavLink>
      ))}
    </Nav>
  );
};

export default BottomNav;
