"use client";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Scores from "./Scores";

const Container = ({ children }) => {
  return (
    <section className="flex flex-row items-center justify-center flex-none w-full bg-background rounded-b-[0.5rem] px-2 gap-2 shadow">
      {children}
    </section>
  );
};

const Content = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-center flex-1 gap-2 min-h-[3rem] pb-2 text-[1.625rem] font-medium">
      {children}
    </div>
  );
};

const Header = ({ matchId }) => {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const isRecording = !segment;

  const handleBack = () => {
    if (matchId === "new") {
      if (segment === "config") return router.push("/history");
      if (segment === "lineup") return router.push("/match/new/config");
      if (segment === "overview") return router.replace("/match/new/lineup");
      return router.back();
    }
    if (!isRecording) return router.push(`/match/${matchId}`);

    return router.push("/history");
  };

  return (
    <Container>
      <Button variant="ghost" size="icon" onClick={() => handleBack()}>
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
        <Button />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/match/${matchId}/config`)}
        >
          <FiSettings />
        </Button>
      )}
    </Container>
  );
};

export default Header;
