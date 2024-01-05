import { useSelector } from "react-redux";
import styled from "styled-components";
import { MdOutlineSportsVolleyball } from "react-icons/md";

const Score = styled.div`
  height: 6rem;
  min-width: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--primary-900);
  svg {
    width: 4rem;
    height: 4rem;
  }
  div {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    &.score {
      font-size: 4rem;
      font-weight: 700;
    }
    &.team {
      font-size: 1.5rem;
      font-weight: 500;
      width: 8rem;
      max-width: 8rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

const Scores = () => {
  const { ours, oppo } = useSelector((state) => state.match.status.scores);
  const { team } = useSelector((state) => state.match.info);

  return (
    <>
      <Score>
        <div className="score">{ours}</div>
        <div className="team">{team.ours.name || "我方"}</div>
      </Score>
      <Score>
        <MdOutlineSportsVolleyball />
        <div>
          <div>0</div>
          <div> - </div>
          <div>0</div>
        </div>
      </Score>
      <Score>
        <div className="score">{oppo}</div>
        <div className="team">{team.oppo.name || "對手"}</div>
      </Score>
    </>
  );
};

export default Scores;
