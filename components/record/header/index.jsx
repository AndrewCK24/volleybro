"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSliders } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Scores } from "@/components/record/header/scores";
import RecordOptions from "@/components/record/options";

export const Header = ({ recordId }) => {
  const router = useRouter();

  return (
    <header className="flex flex-row items-center justify-center w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <FiArrowLeft />
        <span className="sr-only">Back</span>
      </Button>
      <Scores />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <FiSliders />
            <span className="sr-only">Options</span>
          </Button>
        </DialogTrigger>
        <RecordOptions size="lg" />
      </Dialog>
    </header>
  );
};

export default Header;
