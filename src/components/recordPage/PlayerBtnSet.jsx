import styled from "@emotion/styled";

import PlayerBtn from "./PlayerBtn";

const Container = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-areas:
    "player-5 player-4"
    "player-6 player-3"
    "player-1 player-2";
  grid-gap: 1rem;
  .player-1 {
    grid-area: player-1;
  };
  .player-2 {
    grid-area: player-2;
  };
  .player-3 {
    grid-area: player-3;
  };
  .player-4 {
    grid-area: player-4;
  };
  .player-5 {
    grid-area: player-5;
  };
  .player-6 {
    grid-area: player-6;
  };
  /* TODO: 在我方發球時 first-of-child 以特殊色顯示 */
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
    <Container>
      {playersArr.map((player, index) => (
        <PlayerBtn className={player.position} key={index} player={player} />
      ))}
    </Container>
  );
};

export default PlayerBtnSet;