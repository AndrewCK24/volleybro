"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";

export const Main = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <main className="w-full h-full flex flex-col flex-1 pt-[3rem] justify-start items-center md:px-[5%] overflow-y-scroll overscroll-y-contain bg-accent">
      <div
        className={cn(
          "w-full max-w-[640px] min-h-[100%+4rem] gap-2 flex flex-col mb-[4rem] h-fit",
          segments.length > 2 && "mb-4"
        )}
      >
        {children}
      </div>
    </main>
  );
};
