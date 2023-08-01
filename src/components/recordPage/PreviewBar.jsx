import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { recordTypeArr } from "../../utils/recordTypeArr";
import numberFormatter from "../../utils/numberFormatter";

const Container = styled.div`
	flex: 1 1;
	padding: 0 1rem;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
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
	const { name, number } = member || { name: "", number: "" };
	const { scoreOurs, scoreOppo } =
		recordingPlay.typeNum === -1 ? lastPlay : recordingPlay;
	const playType =
		recordingPlay.typeNum === -1
			? recordTypeArr[lastPlay.typeNum]?.text
			: recordTypeArr[recordingPlay.typeNum].text;

	return (
		<Container>
			<ScorePreview>
				<Score>{scoreOurs}</Score>:<Score>{scoreOppo}</Score>
			</ScorePreview>
			<ContentPreview>
				{recordingPlay.playerNum === -1
					? recordingPlay.typeNum === -1
						? lastPlay.isNewSet
							? ``
							: lastPlay.playerNum === -1
							? `${playType}`
							: `${name.padStart(4, "　")}(${numberFormatter(
									number
							  )}) ${playType}`
						: `${playType}`
					: recordingPlay.typeNum === -1
					? `${name.padStart(4, "　")}(${numberFormatter(number)})`
					: `${name.padStart(4, "　")}(${numberFormatter(number)}) ${playType}`}
			</ContentPreview>
		</Container>
	);
};

export default PreviewBar;
