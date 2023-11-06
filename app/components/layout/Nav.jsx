import Link from "next/link";
import styles from "./styles.module.scss";

import {
  FiHome as HomeIcon,
  FiUsers as TeamIcon,
  FiClock as HistoryIcon,
  FiMenu as MenuIcon,
} from "react-icons/fi";

const NavContainer = ({ children }) => {
  return <nav className={styles.nav}>{children}</nav>;
};

const NavLink = ({ children, href, active }) => {
  return (
    <Link
      href={href}
      className={`${styles.nav__link} ${active && styles["nav__link--active"]}`}
    >
      {children}
    </Link>
  );
};

const Nav = ({ pathname }) => {
  const navLinks = [
    { title: "首頁", icon: <HomeIcon />, path: "/" },
    { title: "隊伍", icon: <TeamIcon />, path: "/team" },
    { title: "紀錄", icon: <HistoryIcon />, path: "/history" },
    { title: "選項", icon: <MenuIcon />, path: "/user" },
  ];

  return (
    <NavContainer>
      {navLinks.map(({ title, icon, path }) => (
        <NavLink key={path} href={path} active={pathname === path}>
          {icon}
          {title}
        </NavLink>
      ))}
    </NavContainer>
  );
};

export default Nav;
