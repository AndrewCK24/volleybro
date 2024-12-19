"use client";
import { useRefreshState } from "@/lib/hooks/usePullToRefresh";

export const Main = ({ children }: { children: React.ReactNode }) => {
  const { isRefreshing, isPulling } = useRefreshState();

  return (
    <main className="pt-12">
      <div
        className={`flex items-center justify-center transition-all duration-300 -pb-2 ${
          isPulling || isRefreshing ? "h-12 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div
          className={`w-6 h-6 border-2 rounded-full border-primary border-t-transparent ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </div>
      <div className="w-full max-w-[640px] flex flex-col h-fit mx-auto pb-16 md:px-[5%] gap-2">
        {children}
      </div>
    </main>
  );
};
