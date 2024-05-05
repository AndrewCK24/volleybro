import styled from "styled-components";
import { FiPlus, FiMinus } from "react-icons/fi";
import { recordTypes } from "@/app/lib/record-types";

const Container = ({ children, onClick }) => {
  return (
    <div
      className="flex flex-row items-center justify-start flex-none w-full gap-1 basis-8"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ScoreCell = ({ children }) => {
  return (
    <div className="flex items-center justify-center flex-none basis-8 w-8 h-8 bg-primary-200 text-primary-900 rounded-[0.5rem] font-semibold">
      {children}
    </div>
  );
};

const Score = styled.div`
  flex: 0 0;
  min-width: 2rem;
  min-height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: var(--primary-200);
  font-size: 1.5rem;
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

const RecordText = styled.div`
  max-width: calc(100% - 9rem);
  flex: 1 0;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: row;
  font-size: 1.5rem;
  gap: 0.25rem;
  border-left: 0.125rem solid var(--secondary-500);
  span {
    font-size: 1.5rem;
    font-weight: 600;
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

const IconWin = styled(FiPlus)`
  width: 1.5rem;
  height: 1.5rem;
  color: var(--secondary-500);
  stroke-width: 3;
`;

const IconLose = styled(FiMinus)`
  width: 1.5rem;
  height: 1.5rem;
  color: var(--danger-500);
  stroke-width: 3;
`;

const Record = ({ record, players, editingItem, onClick }) => {
  const { win, ours, oppo } = record;
  const oursType = recordTypes[ours.num];
  const oppoType = recordTypes[oppo.num];

  return (
    <Container onClick={onClick}>
      {ours.type ? (
        <>
          <Score
            className={win ? "win" : editingItem === undefined ? "lose" : ""}
          >
            {ours.score}
          </Score>
          <Score
            className={!win ? "win" : editingItem === undefined ? "lose" : ""}
          >
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
              <span>{players[ours.player]?.number}</span>
              {oursType?.text}
              {ours.type && (win ? <IconWin /> : <IconLose />)}
            </>
          )
        ) : (
          <span>{players[ours.player]?.number}</span>
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
    </Container>
  );
};

export default Record;
