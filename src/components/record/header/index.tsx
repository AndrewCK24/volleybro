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
    <header className="fixed top-0 z-10 flex items-center justify-between w-full max-w-[640px]">
      <div className="flex items-center justify-between w-full gap-2 px-2 rounded-b-lg shadow-sm bg-background pt-[env(safe-area-inset-top)]">
        <Button
          variant="ghost"
          className="[&>svg]:size-8"
          onClick={() => router.back()}
        >
          <RiArrowLeftLine />
          <span className="sr-only">Back</span>
        </Button>
        <Scores
          recordId={recordId}
          onClick={() => handleOptionOpen("overview")}
        />
        <Button
          variant="ghost"
          className="[&>svg]:size-8"
          onClick={() => handleOptionOpen("settings")}
        >
          <RiSettings4Line />
          <span className="sr-only">Options</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
