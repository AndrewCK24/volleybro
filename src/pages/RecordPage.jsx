import { useDispatch } from "react-redux";
import styled from "@emotion/styled";

import ScoreBar from "../components/recordPage/ScoreBar";
import PlayerBtnSet from "../components/recordPage/PlayerBtnSet";
import RecordBtnSet from "../components/recordPage/RecordBtnSet";
import PreviewBar from "../components/recordPage/PreviewBar";
import ScorePanel from "../components/recordPage/ScorePanel";
import { ReactComponent as StatsIcon } from "../images/file-text.svg";
import { playsActions } from "../store/plays-slice";

const Container = styled.div`
	flex: 1 1;
	/* width: calc(100% - 2rem); */
	height: 100%;
	padding: 0 1rem;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	gap: 1rem;
`;

const MainPart = styled.div`
	flex: 1 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	/* display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 3fr 2fr;
	column-gap: 1.5rem;
	row-gap: 1.5rem; */
`;

const ButtonPart = styled.div`
	flex: 3 1;
	display: flex;
	flex-direction: row;
	gap: 1rem;
`;

const InfoPart = styled.div`
	flex: 2 1;
	display: flex;
	flex-direction: row;
	gap: 1rem;
`;

const InfoLeft = styled.div`
	flex: 1 1;
	/* grid-column: 1;
	grid-row: 2; */
	display: flex;
	flex-direction: column;
	gap: 1rem;
	/* display: grid;
	grid-template-rows: 1fr 5fr;
	row-gap: 1rem; */
`;

const InfoRight = styled.div`
	flex: 1 1;
	/* grid-column: 2;
	grid-row: 2; */
	display: flex;
	flex-direction: column;
	gap: 1rem;
	/* display: grid;
	grid-template-rows: 1fr 3fr;
	row-gap: 1rem; */
`;

const ConfirmBtn = styled.button`
	flex: 1 1;
	border: 1px solid var(--yellow-primary);
	border-radius: 1rem;
	background-color: var(--yellow-primary);
	font-size: 2rem;
	font-weight: 700;
`;

const TeamStats = styled.div`
	flex: 3 1;
	border-radius: 1rem;
	background-color: var(--black-primary);
	color: var(--white-primary);
	svg {
		stroke: var(--white-primary);
	}
`;

const RecordPage = () => {
	const dispatch = useDispatch();
	const handleConfirm = () => {
		dispatch(playsActions.recordPlays());
	};

	return (
		<Container>
			<ScoreBar />
			<MainPart>
				<ButtonPart>
					<PlayerBtnSet />
					<RecordBtnSet />
				</ButtonPart>
				<InfoPart>
					<InfoLeft>
						<PreviewBar />
						<ScorePanel />
					</InfoLeft>
					<InfoRight>
						<ConfirmBtn onClick={handleConfirm}>確認</ConfirmBtn>
						<TeamStats>
							<StatsIcon />
						</TeamStats>
					</InfoRight>
				</InfoPart>
			</MainPart>
		</Container>
	);
};

export default RecordPage;
