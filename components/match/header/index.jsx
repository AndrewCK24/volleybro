"use client";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Scores } from "@/components/match/header/scores";

const Content = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-center flex-1 gap-2 min-h-[3rem] text-[1.625rem] font-medium">
      {children}
    </div>
  );
};

export const Header = ({ matchId }) => {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const isRecording = !segment;

  return (
    <header className="flex flex-row items-center justify-center flex-none w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <FiArrowLeft />
      </Button>
      <Content
        onClick={() => isRecording && router.push(`/match/${matchId}/overview`)}
      >
        {segment === "new" ? (
          "新增比賽紀錄"
        ) : isRecording ? (
          <Scores />
        ) : segment === "config" ? (
          "比賽資訊"
        ) : segment === "records" ? (
          "逐球紀錄"
        ) : (
          ""
        )}
      </Content>
      {matchId === "new" || segment === "config" ? (
        <Button variant="ghost" />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/match/${matchId}/config`)}
        >
          <FiSettings />
        </Button>
      )}
    </header>
  );
};

export default Header;
