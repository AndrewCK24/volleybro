import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { typeArr } from "../../utils/playTypeArr";

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
				{
					recordingPlay.typeNum !== -1
						? `${member.name}(${member.number}) ${playType}`
						: recordingPlay.playerNum !== -1
						? `${member.name}(${member.number})` 								// p 有, t 沒有
						: lastPlay?.isNewSet 																// p 沒有, t 沒有
						? `` 																								// 上球無紀錄內容
						: `${member.name}(${member.number}) ${playType}`		// 上球有紀錄內容
				}
			</ContentPreview>
		</Container>
	);
};

export default PreviewBar;
