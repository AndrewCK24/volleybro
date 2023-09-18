import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { recordActions } from "./record-slice";
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";

const Container = styled.button`
  border-radius: 0.5rem;
  font-size: 1.5rem;
  align-items: center;
  justify-content: center;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  column-gap: 0.25rem;
  row-gap: 0.25rem;
  color: var(--color-primary-900);
  svg {
    width: 2rem;
    height: 2rem;
  }
  &.recordOppoBtn {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  &:disabled {
    background-color: var(--gray-secondary);
    div {
      color: var(--gray-primary);
    }
    svg {
      stroke: var(--gray-primary);
    }
  }
  &.toggle {
    background-color: var(--black-primary);
    div {
      color: var(--white-primary);
    }
    svg {
      stroke: var(--white-primary);
    }
  }
`;

const RecordType = styled.div`
  grid-column: 1 / span 2;
  font-size: 1.5rem;
  align-items: center;
`;

const RecordPts = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const RecordBtn = ({ type, records, handleDisabled }) => {
  const dispatch = useDispatch();
  // const isServing = useSelector((state) => state.plays.isServing);
  const { playerNum, typeNum } = useSelector((state) => state.record.data);
  const { position, isServing } = useSelector((state) => state.record.status);
  // const plays = useSelector((state) => state.plays.plays);
  const points = records.filter(
    (record) => record.playerNum === playerNum && record.typeNum === type.num
  ).length;
  // const points = plays.filter(
  // 	(play) => play.playerNum === playerNum && play.typeNum === type.num
  // ).length;

  const handleClick = () => {
    dispatch(
      recordActions.setRecordingDetail({ typeNum: type.num, win: type.win })
    );
  };

  return (
    <Container
      className={`
				${typeNum === type.num ? "toggle" : ""} 
				${playerNum === null ? "recordOppoBtn" : ""}
			`}
      disabled={handleDisabled(type.num, position, isServing)}
      onClick={handleClick}
    >
      <RecordType>{type.text}</RecordType>
      <RecordPts>{playerNum === null ? "--" : points}</RecordPts>
      {type.win ? <HiOutlinePlusCircle /> : <HiOutlineMinusCircle />}
    </Container>
  );
};

export default RecordBtn;
