"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSliders } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Scores } from "@/src/components/record/header/scores";

export const Header = ({ recordId, handleOptionOpen }) => {
  const router = useRouter();

  return (
    <header className="flex flex-row items-center justify-center w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <FiArrowLeft />
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
        <FiSliders />
        <span className="sr-only">Options</span>
      </Button>
    </header>
  );
};

export default Header;
