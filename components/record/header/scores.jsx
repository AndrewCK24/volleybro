"use client";
import { useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { MdOutlineSportsVolleyball } from "react-icons/md";

const Container = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-16 h-20 text-[3rem] svg-[3rem] leading-none font-bold">
      {children}
    </div>
  );
};
const Team = ({ children }) => {
  return (
    <div className="flex items-center justify-center text-[1rem] font-medium w-full max-w-16 overflow-hidden whitespace-nowrap text-ellipsis">
      {children}
    </div>
  );
};

export const Scores = ({ recordId, ...props }) => {
  const { record } = useRecord(recordId);
  const { sets, status } = useSelector((state) => state.record);
  const { home, away } = status.scores;

  return (
    <div
      className="flex flex-row items-center justify-center flex-1 gap-2 min-h-[3rem] text-[1.625rem] font-medium"
      {...props}
    >
      <Container>
        {home}
        <Team>{record?.teams?.home?.name || "我方"}</Team>
      </Container>
      <Container>
        <MdOutlineSportsVolleyball />
        <div className="flex flex-row text-[1.25rem] gap-1 leading-none h-5">
          <div>{sets.filter((set) => set.win === true).length}</div>-
          <div>{sets.filter((set) => set.win === false).length}</div>
        </div>
      </Container>
      <Container>
        {away}
        <Team>{record?.teams?.away?.name || "對手"}</Team>
      </Container>
    </div>
  );
};

export default Scores;
