"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";

export const Main = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <main className="w-full h-full pt-[3rem] md:px-[5%] overflow-y-scroll overscroll-y-contain bg-accent">
      <div className="h-16 -mt-16 pointer-events-none" />
      <div
        className={cn(
          "w-full max-w-[640px] gap-2 flex flex-col h-fit min-h-[calc(100%-4rem)] mb-16 mx-auto",
          segments.length > 2 && "mb-4"
        )}
      >
        {children}
      </div>
      <div className="h-16 pointer-events-none" />
    </main>
  );
};
