import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { ReactComponent as Logo } from "../../images/logo-black.svg";
import { FaVolleyballBall } from "react-icons/fa";

const Container = styled.div`
	flex: 5 1;
	padding: 0.5rem;
	border: 2px solid var(--color-primary-800);
	border-radius: 0.5rem;
	background-color: var(--white-primary);
	display: flex;
	flex-direction: column;
`;

const IndicatorsContainer = styled.div`
	flex: 1 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const SetIndicator = styled.div`
	flex: 1 1;
	font-size: 1.5rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ServeIndicator = styled.div`
	flex: 2 1;
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
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const Score = styled.div`
	flex: 2 1;
	font-size: 4.5rem;
	font-weight: 700;
	margin: auto;
	text-align: center;
	justify-content: center;
`;

const StyledLogo = styled(Logo)`
	flex: 1 1;
`;

const SetsContainer = styled.div`
	flex: 3 1;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	padding: 0.25rem 0.5rem;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
`;

const CellsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Cell = styled.div`
	flex: 1 1;
	font-size: 1.5rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ScorePanel = () => {
	const { isServing } = useSelector((state) => state.record.status);
	const { records } = useSelector((state) => state.record.setData);
	const scoreArr =
		records.length > 0
			? [records[records.length - 1]?.scoreOurs, records[records.length - 1]?.scoreOppo]
			: [0, 0];

	return (
		<Container>
			<IndicatorsContainer>
				<ServeIndicator>{isServing ? <FaVolleyballBall /> : ""}</ServeIndicator>
				<SetIndicator>SET 1</SetIndicator>
				<ServeIndicator>{isServing ? "" : <FaVolleyballBall />}</ServeIndicator>
			</IndicatorsContainer>
			<ScoresContainer>
				<Score>{scoreArr[0]}</Score>
				<StyledLogo />
				<Score>{scoreArr[1]}</Score>
			</ScoresContainer>
			<SetsContainer>
				<CellsContainer>
					<Cell>台大日劇</Cell>
					<Cell>台大生傳</Cell>
				</CellsContainer>
				<CellsContainer>
					<Cell>25</Cell>
					<Cell>23</Cell>
				</CellsContainer>
				<CellsContainer>
					<Cell>25</Cell>
					<Cell>23</Cell>
				</CellsContainer>
				<CellsContainer>
					<Cell>25</Cell>
					<Cell>23</Cell>
				</CellsContainer>
			</SetsContainer>
		</Container>
	);
};

export default ScorePanel;
