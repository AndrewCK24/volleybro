import { useSelector } from "react-redux";
import styled from "@emotion/styled";

const Container = styled.div`
	flex: 1 1;
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
	},
];

const PreviewBar = () => {
	const recordingPlay = useSelector((state) => state.plays.recordingPlay);
	const lastPlay = useSelector((state) => {
		return state.plays.plays.length > 0
			? state.plays.plays[state.plays.plays.length - 1]
			: {
					isNewSet: true,
					scoreOurs: 0,
					scoreOppo: 0,
					win: false,
					playerNum: -1,
					typeNum: -1,
			  };
	});
	const memberArr = useSelector((state) => state.team.members);
	const member = memberArr.find((member) => {
		return recordingPlay.playerNum === -1
			? member.number === lastPlay?.playerNum
			: member.number === recordingPlay.playerNum;
	});
	const playType =
		recordingPlay.typeNum === -1
			? typeArr[lastPlay.typeNum]?.text
			: typeArr[recordingPlay.typeNum].text;

	return (
		<Container>
			<ScorePreview>
				{recordingPlay.typeNum === -1
					? `${lastPlay.scoreOurs}-${lastPlay.scoreOppo}`
					: `${recordingPlay.scoreOurs}-${recordingPlay.scoreOppo}`}
			</ScorePreview>
			<ContentPreview>
				{	// TODO: 優化以下邏輯
					lastPlay?.isNewSet
						? ``
						: recordingPlay.playerNum !== -1
						? recordingPlay.typeNum === -1
							? `${member.name}`
							: `${member.name} ${playType}`
						: `${member.name} ${playType}` // 上球紀錄內容
				}
			</ContentPreview>
		</Container>
	);
};

export default PreviewBar;
