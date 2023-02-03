import React from "react";
import styled from "@emotion/styled";

const RecordPreview = styled.div`
  grid-row: 1;
  align-items: center;
  border: 1px solid var(--black-primary);
  border-radius: 1rem;
  display: flex;
`;

const ScorePreview = styled.p`
  /* FIXME: 使文字垂直置中 需再研究 目前只能單行 */
  padding-left: 1rem;
  font-size: 1.2rem;
  display: inline-block;
`;

const ContentPreview = styled.p`
  padding-left: 0.5rem;
  font-size: 1.2rem;
  display: inline-block;
`;

const PreviewBar = () => {
  return (
    <RecordPreview>
      <ScorePreview>
        24-23 預覽
      </ScorePreview>
      <ContentPreview>
        黃震康 攻擊得分
      </ContentPreview>
    </RecordPreview>
  );
};

export default PreviewBar;