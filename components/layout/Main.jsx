"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";

export const Main = ({ children, className, ...props }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <main
      className={cn(
        "flex-1 pt-[3rem] px-0 pb-[4.5rem]",
        "flex flex-col justify-start items-center gap-2 flex-nowrap",
        "overflow-scroll overscroll-y-contain z-0 bg-accent",
        "md:max-xl:px-[5%] transition-colors",
        segments.length > 2 && "pb-4",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};
