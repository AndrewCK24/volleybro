"use client";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import {
  RiDeviceFill,
  RiDeviceLine,
  RiMoonFill,
  RiMoonLine,
  RiSunFill,
  RiSunLine,
} from "react-icons/ri";

export const DarkMode = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Item asChild variant="muted">
          <button type="button">
            <ItemMedia>
              <RiMoonLine />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>深色模式</ItemTitle>
            </ItemContent>
          </button>
        </Item>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>深色模式</DialogTitle>
          <DialogDescription srOnly>選擇深色模式</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <DialogClose asChild>
            <Button
              variant="segmented"
              aria-pressed={theme === "system"}
              onClick={() => setTheme("system")}
            >
              {theme === "system" ? <RiDeviceFill /> : <RiDeviceLine />}
              系統
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="segmented"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              {theme === "light" ? <RiSunFill /> : <RiSunLine />}
              亮色
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="segmented"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              {theme === "dark" ? <RiMoonFill /> : <RiMoonLine />}
              深色
            </Button>
          </DialogClose>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
