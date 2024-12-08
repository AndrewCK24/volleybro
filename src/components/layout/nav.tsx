"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-data";
import { usePathname } from "next/navigation";
import {
  RiHome5Line as HomeIcon,
  RiGroupLine as TeamIcon,
  RiAddBoxLine as RecordIcon,
  RiNotification2Line as NotificationsIcon,
  RiMenuLine as MenuIcon,
} from "react-icons/ri";

const NavLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className={cn(
      "flex flex-col items-center justify-center flex-1 h-full pt-1",
      "no-underline text-primary-foreground [&>svg]:w-7 [&>svg]:h-7 text-xs",
      "transition-all duration-200 ease-in-out",
      className
    )}
  >
    {children}
  </Link>
);

export const Nav = () => {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const { user } = useUser();
  const defaultTeamId = user?.teams?.joined[0] || null;
  const defaultTeamUrl = defaultTeamId ? `/team/${defaultTeamId}` : "/team";

  const active = (path) => {
    const activeClass =
      "p-0 font-semibold border-t-4 border-primary-foreground";
    if (path === "/") return pathname === "/" ? activeClass : "";
    return pathname.startsWith(path) ? activeClass : "";
  };

  if (segments.length > 2) return null;

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
        href={`/record/new?team=${defaultTeamId}`}
        className="[&>svg]:w-12 [&>svg]:h-12"
        aria-label="Start recording match"
      >
        <RecordIcon />
      </NavLink>
      <NavLink href="/notifications" className={active("/notifications")}>
        <NotificationsIcon />
        通知
      </NavLink>
      <NavLink href="/user" className={active("/user")}>
        <MenuIcon />
        選項
      </NavLink>
    </nav>
  );
};
