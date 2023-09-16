import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { recordTypeArr } from "../../utils/recordTypeArr";
import numberFormatter from "../../utils/numberFormatter";

const Container = styled.div`
  flex: 1 1;
  padding: 0 1rem;
  border: 2px solid var(--color-secondary-800);
  border-radius: 0.5rem;
  background-color: var(--white-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScorePreview = styled.div`
  flex: 0 1 3.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Score = styled.div`
  flex: 1 1 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ContentPreview = styled.div`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewBar = () => {
  const recordingData = useSelector((state) => state.record.data);
  const { records } = useSelector((state) => state.record.setData);
  const lastRecord =
    records.length > 0
      ? records[records.length - 1]
      : {
          isNewSet: true,
          scoreOurs: 0,
          scoreOppo: 0,
          win: false,
          playerNum: null,
          typeNum: 0,
        };
  const memberArr = useSelector((state) => state.team.members);
  const member = memberArr.find((member) => {
    return recordingData.playerNum === null
      ? member.number === lastRecord?.playerNum
      : member.number === recordingData.playerNum;
  });
  const { name, number } = member || { name: "", number: "" };
  const { scoreOurs, scoreOppo } = recordingData.typeNum
    ? recordingData
    : lastRecord;
  const playType = recordingData.typeNum
    ? recordTypeArr[recordingData.typeNum - 1]?.text
    : recordTypeArr[lastRecord.typeNum - 1]?.text;

  return (
    <Container>
      <ScorePreview>
        <Score>{scoreOurs}</Score>:<Score>{scoreOppo}</Score>
      </ScorePreview>
      <ContentPreview>
        {recordingData.playerNum === null
          ? recordingData.typeNum === 0
            ? lastRecord.isNewSet
              ? ``
              : lastRecord.playerNum === null
              ? `${playType}`
              : `${name.padStart(4, "　")}(${numberFormatter(
                  number
                )}) ${playType}`
            : `${playType}`
          : recordingData.typeNum === 0
          ? `${name.padStart(4, "　")}(${numberFormatter(number)})`
          : `${name.padStart(4, "　")}(${numberFormatter(number)}) ${playType}`}
      </ContentPreview>
    </Container>
  );
};

export default PreviewBar;
