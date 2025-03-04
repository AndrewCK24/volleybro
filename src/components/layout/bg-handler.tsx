"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const BackgroundColorHandler = () => {
  const pathname: string = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      document.body.style.backgroundColor = "var(--color-primary)";
    } else {
      document.body.style.backgroundColor = "var(--color-accent)";
    }
  }, [pathname]);

  return null;
};

export default BackgroundColorHandler;
