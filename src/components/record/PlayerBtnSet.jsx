import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import PlayerBtn from "./PlayerBtn";

const Container = styled.div`
  flex: 3 1;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary-200);
  display: grid;
  grid-template-areas:
    "p4 p3 p2"
    "p5 p6 p1"
    "l btn btn";
  grid-gap: 0.5rem;
  .p1 {
    grid-area: p1;
  }
  .p2 {
    grid-area: p2;
  }
  .p3 {
    grid-area: p3;
  }
  .p4 {
    grid-area: p4;
  }
  .p5 {
    grid-area: p5;
  }
  .p6 {
    grid-area: p6;
  }
  /* TODO: 在我方發球時 first-of-child 以特殊色顯示 */
`;

const PlayerBtnSet = () => {
  const positionArr = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const lineup = useSelector((state) => state.record.setData.lineup.ours);
  const libero = useSelector((state) => state.record.setData.libero.ours);

  return (
    <Container>
      {lineup.map((player, index) => (
        <PlayerBtn
          className={positionArr[index]}
          key={index}
          player={player}
          position={index + 1}
        />
      ))}
      <PlayerBtn className="l" player={libero} position="L" />
    </Container>
  );
};

export default PlayerBtnSet;
