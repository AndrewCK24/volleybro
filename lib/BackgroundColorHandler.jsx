"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const BackgroundColorHandler = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/sign")) {
      document.body.style.backgroundColor = "rgba(var(--primary))";
    } else {
      document.body.style.backgroundColor = "rgba(var(--background))";
    }
  }, [pathname]);
};

export default BackgroundColorHandler;
