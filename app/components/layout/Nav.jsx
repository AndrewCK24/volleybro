"use client";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { matchActions } from "@/app/match/match-slice";
import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiPlusSquare as RecordIcon,
  FiClock as HistoryIcon,
  FiMenu as MenuIcon,
} from "react-icons/fi";

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 3.875rem;
  width: 100%;
  padding: 0 5% 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary-500);
`;

const NavLink = styled(Link)`
  flex: 1 1;
  height: 100%;
  padding: 0.25rem 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--primary-200);
  font-size: 0.75rem;
  gap: 0.125rem;

  transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out,
    border 0.2s ease-in-out;

  svg {
    stroke: var(--primary-200);
    height: 1.75rem;
    width: 1.75rem;
  }

  &.active {
    border-top: 0.25rem solid var(--primary-100);
    padding: 0;
    color: var(--primary-100);
    font-weight: 600;

    svg {
      stroke: var(--primary-100);
    }
  }

  &.large {
    svg {
      width: 3rem;
      height: 3rem;
    }
  }
`;

export const Nav = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  return (
    <Container>
      <NavLink href="/" className={pathname === "/" && "active"}>
        <HomeIcon />
        首頁
      </NavLink>
      <NavLink
        href="/team"
        className={pathname.startsWith("/team") && "active"}
      >
        <TeamIcon />
        隊伍
      </NavLink>
      <NavLink
        href="/match/new/config"
        className="large"
        aria-label="Start recording match"
        onClick={() => dispatch(matchActions.resetMatch())}
      >
        <RecordIcon />
      </NavLink>
      <NavLink
        href="/history"
        className={pathname.startsWith("/history") && "active"}
      >
        <HistoryIcon />
        紀錄
      </NavLink>
      <NavLink
        href="/user"
        className={pathname.startsWith("/user") && "active"}
      >
        <MenuIcon />
        選項
      </NavLink>
    </Container>
  );
};
