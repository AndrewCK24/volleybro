import { useState } from "react";
import styled from "@emotion/styled";

import ScoreBar from "../components/recordPage/ScoreBar";
import PlayerBtnSet from "../components/recordPage/PlayerBtnSet";
import RecordBtnSet from "../components/recordPage/RecordBtnSet";
import PreviewBar from "../components/recordPage/PreviewBar";
import { ReactComponent as StatsIcon } from "../images/file-text.svg";

const Container = styled.div`
	width: 100%;
	height: 100%;
	padding: 2rem 1rem 0;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: stretch;
	gap: 1rem;
`;

const MainPart = styled.div`
	flex: 1 1 20rem;
	height: 100%;
	grid-column: 4 / span 8;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 2fr 1fr;
	column-gap: 1.5rem;
	row-gap: 1.5rem;
`;

const InfoLeft = styled.div`
	grid-column: 1;
	grid-row: 2;
	display: grid;
	grid-template-rows: repeat(5, minmax(0, 1fr));
	row-gap: 1rem;
`;

const Scores = styled.div`
	grid-row: 2 / -1;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
`;

const InfoRight = styled.div`
	grid-column: 2;
	grid-row: 2;
	display: grid;
	grid-template-rows: repeat(3, minmax(0, 1fr));
	row-gap: 1rem;
`;

const ConfirmBtn = styled.button`
	grid-row: 1;
	border: 1px solid var(--yellow-primary);
	border-radius: 1rem;
	background-color: var(--yellow-primary);
	font-size: 2rem;
	font-weight: 700;
`;

const TeamStats = styled.div`
	grid-row: 2 / -1;
	border-radius: 1rem;
	background-color: var(--black-primary);
	color: var(--white-primary);
	svg {
		stroke: var(--white-primary);
	}
`;

const RecordPage = () => {
  const [play, setPlay] = useState({
    scoreOurs: 0,
    scoreOppo: 0,
    win: false,
    playerNum: -1,
    type: "",
		typeNum: -1,
  });
  
	return (
		<Container>
			<ScoreBar />
			<MainPart>
				<PlayerBtnSet play={play} setPlay={setPlay} />
				<RecordBtnSet play={play} setPlay={setPlay} />
				<InfoLeft>
					<PreviewBar play={play} />
					<Scores></Scores>
				</InfoLeft>
				<InfoRight>
					<ConfirmBtn>確認</ConfirmBtn>
					<TeamStats>
						<StatsIcon />
					</TeamStats>
				</InfoRight>
			</MainPart>
		</Container>
	);
};

export default RecordPage;
