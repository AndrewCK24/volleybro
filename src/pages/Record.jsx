import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import ScoreBar from "../components/recordPage/ScoreBar";
import PlayerBtnSet from "../components/recordPage/PlayerBtnSet";
import RecordBtnSet from "../components/recordPage/RecordBtnSet";
import PreviewBar from "../components/recordPage/PreviewBar";
import ScorePanel from "../components/recordPage/ScorePanel";
import { FiFileText } from "react-icons/fi";
import { recordActions } from "../store/record-slice";

const Container = styled.div`
  flex: 1 1;
  height: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 1rem;
`;

const MainPart = styled.div`
  flex: 1 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonPart = styled.div`
  flex: 3 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const InfoPart = styled.div`
  flex: 2 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Info = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConfirmBtn = styled.button`
  flex: 1 1;
  border: 1px solid var(--yellow-primary);
  border-radius: 1rem;
  background-color: var(--yellow-primary);
  font-size: 2rem;
  font-weight: 700;
`;

const TeamStats = styled.div`
  flex: 3 1;
  padding: 0.5rem;
  border-radius: 1rem;
  background-color: var(--black-primary);
  color: var(--white-primary);
  svg {
    width: 1.5rem;
    height: 1.5rem;
    stroke: var(--white-primary);
  }
`;

const RecordPage = () => {
  const dispatch = useDispatch();
  const { typeNum } = useSelector((state) => state.record.data);
  const handleConfirm = () => {
    dispatch(recordActions.createRecord());
  };

  return (
    <Container>
      <ScoreBar />
      <MainPart>
        <ButtonPart>
          <PlayerBtnSet />
          <RecordBtnSet />
        </ButtonPart>
        <InfoPart>
          <Info>
            <PreviewBar />
            <ScorePanel />
          </Info>
          <Info>
            <ConfirmBtn onClick={handleConfirm} disabled={!typeNum}>
              確認
            </ConfirmBtn>
            <TeamStats>
              <FiFileText />
            </TeamStats>
          </Info>
        </InfoPart>
      </MainPart>
    </Container>
  );
};

export default RecordPage;
