import React from "react";
import styled from "@emotion/styled";

import { ReactComponent as PlayerIcon } from "../../images/user.svg";

const PlayerBtn = styled.button`
  border: 1px solid var(--black-primary);
  border-radius: 1rem;
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 2fr repeat(2, minmax(0, 1fr));
`;

const Number = styled.div`
  grid-column: 1;
  grid-row: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
`;

const Name = styled.div`
  grid-column: 1;
  grid-row: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const Role = styled.div`
  grid-column: 2;
  grid-row: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Points = styled.div`
  grid-column: 1;
  grid-row: 3;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Player = styled.div`
  grid-column: 2;
  grid-row: 3;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


// TODO: 將arr的內容引入先發球員名單陣列 包含自由球員
const playersArr = [
  {
    number: 7,
    name: "曾立維",
    role: "S",
    point: 3,
    position: "player-1"
  },
  {
    number: 14,
    name: "賴博劭",
    role: "OH",
    point: 5,
    position: "player-2"
  },
  {
    number: 17,
    name: "黃震康",
    role: "MB",
    point: 5,
    position: "player-3"
  },
  {
    number: 2,
    name: "許瑋哲",
    role: "OP",
    point: 2,
    position: "player-4"
  },
  {
    number: 16,
    name: "朱易",
    role: "OH",
    point: 3,
    position: "player-5"
  },
  {
    number: 24,
    name: "莊予樂",
    role: "MB",
    point: 1,
    position: "player-6"
  }
];

const PlayerBtnSet = () => {
  return (
    <>
      {playersArr.map((player, index) => (
        <PlayerBtn className={player.position} key={index}>
          <Number>{player.number}</Number>
          <Name>{player.name}</Name>
          <Role>{player.role}</Role>
          <Points>{player.point} pts</Points>
          <Player><PlayerIcon /></Player>
        </PlayerBtn>
      ))}
    </>
  );
};

export default PlayerBtnSet;