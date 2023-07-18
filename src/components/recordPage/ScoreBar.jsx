import React from "react";
import styled from "@emotion/styled";

const ScoreDiv = styled.div`
  height: 100%;
  padding: 1rem 0;
  grid-column: 1 / span 2;
  background-color: var(--yellow-primary);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  touch-action: pan-y;
  overscroll-behavior-y: none;
  /* TODO: 增加可滑動時上下方內陰影 https://ithelp.ithome.com.tw/articles/10188293 */
  /* TODO: add className .scrollbar-hidden from index.css */
  -ms-overflow-style: none;   /* Hide scrollbar for Edge */
  scrollbar-width: none;      /* FireFox */
  ::-webkit-scrollbar {       /* Chrome, Safari and Opera */
    display: none;
  };
`;

const playsArr = [
  {
    playNum: 1,
    scoreOur: 1,
    scoreOpo: 0, 
    win: true,
    playerNum: 7,
    playType: "serve",
  },
  {
    playNum: 2,
    scoreOur: 1,
    scoreOpo: 1, 
    win: false,
    playerNum: 17,
    playType: "defense",
  },
  {
    playNum: 3,
    scoreOur: 2,
    scoreOpo: 1, 
    win: true,
    playerNum: 16,
    playType: "attack",
  },
  {
    playNum: 4,
    scoreOur: 3,
    scoreOpo: 1, 
    win: true,
    playerNum: 7,
    playType: "attack",
  },
  {
    playNum: 1,
    scoreOur: 1,
    scoreOpo: 0, 
    win: true,
    playerNum: 7,
    playType: "serve",
  },
  {
    playNum: 2,
    scoreOur: 1,
    scoreOpo: 1, 
    win: false,
    playerNum: 17,
    playType: "defense",
  },
  {
    playNum: 3,
    scoreOur: 2,
    scoreOpo: 1, 
    win: true,
    playerNum: 16,
    playType: "attack",
  },
  {
    playNum: 4,
    scoreOur: 3,
    scoreOpo: 1, 
    win: true,
    playerNum: 7,
    playType: "attack",
  },
  {
    playNum: 1,
    scoreOur: 1,
    scoreOpo: 0, 
    win: true,
    playerNum: 7,
    playType: "serve",
  },
  {
    playNum: 2,
    scoreOur: 1,
    scoreOpo: 1, 
    win: false,
    playerNum: 17,
    playType: "defense",
  },
  {
    playNum: 3,
    scoreOur: 2,
    scoreOpo: 1, 
    win: true,
    playerNum: 16,
    playType: "attack",
  },
  {
    playNum: 4,
    scoreOur: 3,
    scoreOpo: 1, 
    win: true,
    playerNum: 7,
    playType: "attack",
  },
  {
    playNum: 1,
    scoreOur: 1,
    scoreOpo: 0, 
    win: true,
    playerNum: 7,
    playType: "serve",
  },
  {
    playNum: 2,
    scoreOur: 1,
    scoreOpo: 1, 
    win: false,
    playerNum: 17,
    playType: "defense",
  },
  {
    playNum: 3,
    scoreOur: 2,
    scoreOpo: 1, 
    win: true,
    playerNum: 16,
    playType: "attack",
  },
  {
    playNum: 4,
    scoreOur: 3,
    scoreOpo: 1, 
    win: true,
    playerNum: 7,
    playType: "attack",
  },
  {
    playNum: 1,
    scoreOur: 1,
    scoreOpo: 0, 
    win: true,
    playerNum: 7,
    playType: "serve",
  },
  {
    playNum: 2,
    scoreOur: 1,
    scoreOpo: 1, 
    win: false,
    playerNum: 17,
    playType: "defense",
  },
  {
    playNum: 3,
    scoreOur: 2,
    scoreOpo: 1, 
    win: true,
    playerNum: 16,
    playType: "attack",
  },
  {
    playNum: 4,
    scoreOur: 3,
    scoreOpo: 1, 
    win: true,
    playerNum: 7,
    playType: "attack",
  },
];

const ScoreCellBox = styled.div`
  width: 5rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const ScoreCellLeft = styled.div`
  height: 2.5rem;
  grid-column: 1 / span 1;
  border: 2px solid black;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
`;

const ScoreCellRight = styled.div`
  height: 2.5rem;
  grid-column: 2 / span 1;
  border: 2px solid black;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
`;

const ScoreBar = () => {
  return (
    <ScoreDiv>
      {playsArr.map((play, index) => (
        <ScoreCellBox key={index}>
          {
            play.win
            ? <ScoreCellLeft>{play.scoreOur}</ScoreCellLeft>
            : <ScoreCellRight>{play.scoreOpo}</ScoreCellRight>
          }
        </ScoreCellBox>
      ))}
      <ScoreCellBox></ScoreCellBox>
    </ScoreDiv>
  );
};

export default ScoreBar;