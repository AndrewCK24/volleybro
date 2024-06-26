"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSliders } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Scores } from "@/components/record/header/scores";

export const Header = ({ recordId }) => {
  const router = useRouter();

  return (
    <header className="flex flex-row items-center justify-center w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <FiArrowLeft />
      </Button>
      <Scores />
      <Button variant="ghost" size="icon">
        <FiSliders />
      </Button>
    </header>
  );
};

export default Header;
