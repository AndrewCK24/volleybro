import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { ReactComponent as Logo } from "../../images/logo-black.svg";

const Container = styled.div`
	flex: 5 1;
	padding: 0.25rem;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	/* display: grid;
	grid-template-rows: 1fr 3fr 2fr;
	row-gap: 0.5rem; */
`;

const SetIndicator = styled.div`
	flex: 1 1;
	font-size: 1.5rem;
	font-weight: 700;
	align-items: center;
	text-align: center;
	justify-content: center;
`;

const ScoreContainer = styled.div`
	flex: 3 1;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	column-gap: 0.25rem;
`;

const Score = styled.div`
	font-size: 4.5rem;
	font-weight: 700;
	margin: auto;
	text-align: center;
	justify-content: center;
`;

const ScorePanel = () => {
	const plays = useSelector((state) => state.plays.plays);
	const scoreArr = plays
		? [plays[plays.length - 1]?.scoreOurs, plays[plays.length - 1]?.scoreOppo]
		: [0, 0];

	return (
		<Container>
			<SetIndicator>SET 1</SetIndicator>
			<ScoreContainer>
				<Score>{scoreArr[0]}</Score>
				<Score>
					<Logo />
				</Score>
				<Score>{scoreArr[1]}</Score>
			</ScoreContainer>
		</Container>
	);
};

export default ScorePanel;
