"use client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { RiArrowLeftLine, RiNotification2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";

export const Header = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;

  return (
    <header
      className={cn(
        "fixed w-full h-12 px-[5%] flex flex-row items-center justify-center gap-4 overscroll-none bg-primary-foreground shadow-md",
        className
      )}
    >
      {isIndex || (
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="svg-[2rem]"
        >
          <RiArrowLeftLine />
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
        <RiNotification2Line />
        <span className="sr-only">notifications</span>
      </Button>
    </header>
  );
};
