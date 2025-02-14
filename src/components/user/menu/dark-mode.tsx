"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  RiSunLine,
  RiSunFill,
  RiMoonLine,
  RiMoonFill,
  RiDeviceLine,
  RiDeviceFill,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const DarkMode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="wide">
        <RiMoonLine />
        深色模式
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="wide">
          <RiMoonLine />
          深色模式
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>深色模式</DialogTitle>
          <DialogDescription className="sr-only">
            選擇深色模式
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <DialogClose asChild>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              {theme === "system" ? <RiDeviceFill /> : <RiDeviceLine />}
              系統
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              {theme === "light" ? <RiSunFill /> : <RiSunLine />}
              亮色
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              {theme === "dark" ? <RiMoonFill /> : <RiMoonLine />}
              深色
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
