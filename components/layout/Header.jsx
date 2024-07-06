"use client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;

  return (
    <header className="fixed w-full h-12 px-[5%] flex flex-row items-center justify-center gap-4 overscroll-none bg-primary-foreground shadow-md">
      {isIndex || (
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="svg-[2rem]"
        >
          <FiArrowLeft />
        </Button>
      )}
      <h1
        className={cn(
          "flex-1 text-[1.625rem] font-medium text-left m-0",
          isIndex || "text-center"
        )}
      >
        VolleyBro
      </h1>
      <Button variant="ghost" size="icon" className="svg-[2rem]">
        <FiBell />
      </Button>
    </header>
  );
};
