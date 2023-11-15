"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";

import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiPlusSquare as RecordIcon,
  FiClock as HistoryIcon,
  FiMenu as MenuIcon,
} from "react-icons/fi";

const NavLink = ({ children, href, active, record }) => {
  return (
    <Link
      href={href}
      className={`${styles.nav__link} ${
        active && styles["nav__link--active"]
      } ${record && styles["nav__link--record"]}`}
    >
      {children}
    </Link>
  );
};

export const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      <NavLink href="/" active={pathname === "/"}>
        <HomeIcon />
        首頁
      </NavLink>
      <NavLink href="/team" active={pathname.startsWith("/team")}>
        <TeamIcon />
        隊伍
      </NavLink>
      <NavLink href="/record" record={true}>
        <RecordIcon />
      </NavLink>
      <NavLink href="/history" active={pathname.startsWith("/history")}>
        <HistoryIcon />
        紀錄
      </NavLink>
      <NavLink href="/user" active={pathname.startsWith("/user")}>
        <MenuIcon />
        選項
      </NavLink>
    </nav>
  );
};
