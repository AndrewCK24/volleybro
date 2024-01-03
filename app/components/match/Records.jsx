import styled from "styled-components";
import { FiPlus, FiMinus, FiTriangle } from "react-icons/fi";
import { recordTypes } from "@/app/lib/record-types";

export const RecordContainer = styled.div`
  flex: 0 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
`;

export const Score = styled.div`
  flex: 0 0;
  min-width: 3rem;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: var(--primary-200);
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-900);
  &.win {
    background-color: var(--secondary-500);
    color: var(--primary-100);
  }
  &.lose {
    opacity: 0;
  }
`;

export const RecordText = styled.div`
  max-width: calc(100% - 9rem);
  flex: 1 0;
  padding: 0 0.75rem;
  display: flex;
  flex-direction: row;
  font-size: 2rem;
  gap: 0.5rem;
  border-left: 0.25rem solid var(--secondary-500);
  span {
    font-size: 2rem;
    font-weight: 700;
  }
  &.editing {
    animation: skeleton 0.75s linear infinite alternate;
    @keyframes skeleton {
      0% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

export const IconWin = styled(FiPlus)`
  width: 2rem;
  height: 2rem;
  color: var(--secondary-500);
  stroke-width: 3;
`;

export const IconLose = styled(FiMinus)`
  width: 2rem;
  height: 2rem;
  color: var(--danger-500);
  stroke-width: 3;
`;

export const IconError = styled(FiTriangle)`
  width: 2rem;
  height: 2rem;
  color: var(--danger-500);
  stroke-width: 3;
`;

const Record = ({ record, editingItem }) => {
  const { win, ours, oppo, zone } = record;
  const oursType = recordTypes[ours.num];
  const oppoType = recordTypes[oppo.num];

  return (
    <RecordContainer>
      {ours.type ? (
        <>
          <Score className={win ? "win" : zone === undefined ? "lose" : ""}>
            {ours.score}
          </Score>
          <Score className={!win ? "win" : zone === undefined ? "lose" : ""}>
            {oppo.score}
          </Score>
        </>
      ) : (
        <>
          <Score>{ours.score}</Score>
          <Score>{oppo.score}</Score>
        </>
      )}
      <RecordText className={editingItem === "ours" && "editing"}>
        {ours.type ? (
          ours.type === "oppo-error" ? (
            <>
              對方失誤
              <IconWin />
            </>
          ) : (
            <>
              <span>{ours.player.number}</span>
              {oursType?.text}
              {ours.type && (win ? <IconWin /> : <IconLose />)}
            </>
          )
        ) : (
          <span>{ours.player.number}</span>
        )}
      </RecordText>
      <RecordText className={editingItem === "oppo" && "editing"}>
        {oppo.type &&
          (oppo.type === "oppo-error" ? (
            <>
              我方失誤
              <IconWin />
            </>
          ) : (
            <>
              對方{oppoType?.text}
              {win ? <IconLose /> : <IconWin />}
            </>
          ))}
      </RecordText>
    </RecordContainer>
  );
};

export default Record;
