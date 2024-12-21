"use client";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-data";
import { usePathname } from "next/navigation";
import {
  RiHome5Line,
  RiHome5Fill,
  RiGroupLine,
  RiGroupFill,
  RiAddBoxLine,
  RiNotification2Line,
  RiNotification2Fill,
  RiMenuLine,
  RiMenuFill,
} from "react-icons/ri";

const NavLink = ({
  href,
  pathname,
  activeIcon,
  inactiveIcon,
  className,
  children,
}: {
  href: string;
  pathname?: string;
  activeIcon?: React.ReactNode;
  inactiveIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => {
  const active = ((href, pathname) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  })(href, pathname);
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full pt-2",
        "no-underline text-foreground [&>svg]:w-7 [&>svg]:h-7 text-xs",
        "transition-all duration-200 ease-in-out",
        active && "pt-1 font-semibold border-t-4 border-primary text-primary",
        className
      )}
    >
      {active ? activeIcon : inactiveIcon}
      {children}
    </Link>
  );
};

export const Nav = () => {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const { user } = useUser();
  const defaultTeamId = user?.teams?.joined[0] || null;
  const defaultTeamUrl = defaultTeamId ? `/team/${defaultTeamId}` : "/team";

  if (segments.length > 2) return null;

  return (
    <nav className="fixed bottom-0 left-0 flex flex-row items-center justify-center w-full pb-[calc(env(safe-area-inset-bottom)-1rem)] bg-background">
      <NavLink
        href="/"
        pathname={pathname}
        activeIcon={<RiHome5Fill />}
        inactiveIcon={<RiHome5Line />}
      >
        首頁
      </NavLink>
      <NavLink
        href={defaultTeamUrl}
        pathname={pathname}
        activeIcon={<RiGroupFill />}
        inactiveIcon={<RiGroupLine />}
      >
        隊伍
      </NavLink>
      <NavLink
        href={`/team/${defaultTeamId}/records/new`}
        pathname={pathname}
        className="[&>svg]:w-10 [&>svg]:h-10"
        aria-label="Start recording match"
      >
        <RiAddBoxLine />
      </NavLink>
      <NavLink
        href="/notifications"
        pathname={pathname}
        activeIcon={<RiNotification2Fill />}
        inactiveIcon={<RiNotification2Line />}
      >
        通知
      </NavLink>
      <NavLink
        href="/user"
        pathname={pathname}
        activeIcon={<RiMenuFill />}
        inactiveIcon={<RiMenuLine />}
      >
        選項
      </NavLink>
    </nav>
  );
};
