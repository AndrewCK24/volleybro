import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { ReactComponent as Logo } from "../../images/logo-black.svg";
import { FaVolleyballBall } from "react-icons/fa";

const Container = styled.div`
	flex: 5 1;
	padding: 0.5rem;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const IndicatorsContainer = styled.div`
	flex: 1 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const Indicator = styled.div`
	flex: 1 1;
	font-size: 1.5rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		width: 1.5rem;
		height: 1.5rem;
	}
`;

const ScoresContainer = styled.div`
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

const SetsContainer = styled.div`
	flex: 3 1;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
`;

const ScorePanel = () => {
	const isServing = useSelector((state) => state.plays.isServing);
	const plays = useSelector((state) => state.plays.plays);
	const scoreArr =
		plays.length > 0
			? [plays[plays.length - 1]?.scoreOurs, plays[plays.length - 1]?.scoreOppo]
			: [0, 0];

	return (
		<Container>
			<IndicatorsContainer>
				<Indicator>{isServing ? <FaVolleyballBall /> : ""}</Indicator>
				<Indicator>SET 1</Indicator>
				<Indicator>{isServing ? "" : <FaVolleyballBall />}</Indicator>
			</IndicatorsContainer>
			<ScoresContainer>
				<Score>{scoreArr[0]}</Score>
				<Score>
					<Logo />
				</Score>
				<Score>{scoreArr[1]}</Score>
			</ScoresContainer>
			<SetsContainer>

			</SetsContainer>
		</Container>
	);
};

export default ScorePanel;
