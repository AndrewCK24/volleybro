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

const typeArr = [
	{
		text: "發球得分",
		type: "service",
		win: true,
		num: 0,
	},
	{
		text: "發球失誤",
		type: "service",
		win: false,
		num: 1,
	},
	{
		text: "攻擊得分",
		type: "attack",
		win: true,
		num: 2,
	},
	{
		text: "攻擊失誤",
		type: "attack",
		win: false,
		num: 3,
	},
	{
		text: "攔網得分",
		type: "block",
		win: true,
		num: 4,
	},
	{
		text: "攔網失誤",
		type: "block",
		win: false,
		num: 5,
	},
	{
		text: "接發失誤",
		type: "receive",
		win: false,
		num: 6,
	},
	{
		text: "防守失誤",
		type: "defense",
		win: false,
		num: 7,
	},
	{
		text: "二傳失誤",
		type: "set",
		win: false,
		num: 8,
	},
	{
		text: "犯規",
		type: "fault",
		win: false,
		num: 9,
	}
];


const PreviewBar = ({ play }) => {
  return (
    <RecordPreview>
      <ScorePreview>
        24-23 預覽
      </ScorePreview>
      <ContentPreview>
        黃震康 {play.typeNum === -1 ? "" : typeArr[play.typeNum].text}
      </ContentPreview>
    </RecordPreview>
  );
};

export default PreviewBar;