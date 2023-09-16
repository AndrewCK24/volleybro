import { useSelector } from "react-redux";
import styled from "@emotion/styled";

const Container = styled.div`
  flex: 0 0 6rem;
  /* height: 100%; */
  width: fit-content;
  padding: 1rem 0.5rem;
  color: var(--color-secondary-100);
  background-color: var(--color-primary-500);
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
  -ms-overflow-style: none; /* Hide scrollbar for Edge */
  scrollbar-width: none; /* FireFox */
  ::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
  }
`;

const ScoreCellBox = styled.div`
  width: 5rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const ScoreCell = styled.div`
  height: 2.5rem;
  border: 2px solid var(--color-secondary-100);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  &.winOurs {
    grid-column: 1 / span 1;
  }
  &.winOppo {
    grid-column: 2 / span 1;
  }
`;

const ScoreBar = () => {
  const { records } = useSelector((state) => state.record.setData);

  return (
    <Container>
      {records.map((record, index) => (
        <ScoreCellBox key={index}>
          {record.win ? (
            <ScoreCell className="winOurs">{record.scoreOurs}</ScoreCell>
          ) : (
            <ScoreCell className="winOppo">{record.scoreOppo}</ScoreCell>
          )}
        </ScoreCellBox>
      ))}
      <ScoreCellBox></ScoreCellBox>
    </Container>
  );
};

export default ScoreBar;
