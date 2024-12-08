"use client";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiSettings4Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Scores } from "@/components/record/header/scores";

export const Header = ({
  recordId,
  handleOptionOpen,
}: {
  recordId?: string;
  handleOptionOpen?: (option: string) => void;
}) => {
  const router = useRouter();

  return (
    <header className="flex flex-row items-center justify-center w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <RiArrowLeftLine />
        <span className="sr-only">Back</span>
      </Button>
      <Scores
        recordId={recordId}
        onClick={() => handleOptionOpen("overview")}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOptionOpen("settings")}
      >
        <RiSettings4Line />
        <span className="sr-only">Options</span>
      </Button>
    </header>
  );
};

export default Header;
