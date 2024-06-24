"use client";
import { useSelector } from "react-redux";
import { MdOutlineSportsVolleyball } from "react-icons/md";

const Container = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-16 h-16 text-[3rem] svg-[3rem] leading-none font-bold">
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

export const Scores = () => {
  const { ours, oppo } = useSelector((state) => state.match.status.scores);
  const { team } = useSelector((state) => state.match.info);
  const { sets } = useSelector((state) => state.match);

  return (
    <>
      <Container>
        {ours}
        <Team>{team.ours.name || "我方"}</Team>
      </Container>
      <Container>
        <MdOutlineSportsVolleyball />
        <div className="flex flex-row text-[1.25rem] gap-1 leading-none">
          <div>{sets.filter((set) => set.win === true).length}</div>-
          <div>{sets.filter((set) => set.win === false).length}</div>
        </div>
      </Container>
      <Container>
        {oppo}
        <Team>{team.oppo.name || "對手"}</Team>
      </Container>
    </>
  );
};

export default Scores;
