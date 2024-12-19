"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const BackgroundColorHandler = () => {
  const pathname: string = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      document.body.style.backgroundColor = "rgba(var(--primary))";
    } else {
      document.body.style.backgroundColor = "rgba(var(--accent))";
    }
  }, [pathname]);

  return null;
};

export default BackgroundColorHandler;
