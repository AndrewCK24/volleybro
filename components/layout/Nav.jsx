"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-data";
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

const NavLink = ({ children, className, ...props }) => (
  <Link
    className={cn(
      "flex flex-col items-center justify-center flex-1 h-full pt-1 no-underline text-primary-foreground svg-[1.75rem] text-xs transition-all duration-200 ease-in-out",
      className
    )}
    {...props}
  >
    {children}
  </Link>
);

export const Nav = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { user } = useUser();
  const defaultTeamId = user?.teams?.joined[0] || null;
  const defaultTeamUrl = defaultTeamId
    ? `/team/${defaultTeamId}`
    : "/user/invitations";

  const active = (path) => {
    const activeClass =
      "p-0 font-semibold border-t-4 border-primary-foreground";
    if (path === "/") return pathname === "/" ? activeClass : "";
    return pathname.startsWith(path) ? activeClass : "";
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 px-[5%] pt-0 pb-4 flex flex-row items-center justify-center bg-primary">
      <NavLink href="/" className={active("/")}>
        <HomeIcon />
        首頁
      </NavLink>
      <NavLink href={defaultTeamUrl} className={active("/team")}>
        <TeamIcon />
        隊伍
      </NavLink>
      <NavLink
        href="/match/new/config"
        className="svg-[3rem]"
        aria-label="Start recording match"
        onClick={() => dispatch(matchActions.resetMatch())}
      >
        <RecordIcon />
      </NavLink>
      <NavLink href="/history" className={active("/history")}>
        <HistoryIcon />
        紀錄
      </NavLink>
      <NavLink href="/user" className={active("/user")}>
        <MenuIcon />
        選項
      </NavLink>
    </nav>
  );
};
