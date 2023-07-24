import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { playsActions } from "../../store/plays-slice";
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";

const Container = styled.button`
	display: grid;
	grid-template-columns: 3fr 1fr 1fr;
	column-gap: 0.25rem;
	border: 1px solid var(--black-primary);
	border-radius: 0.5rem;
	font-size: 1.5rem;
	align-items: center;
	justify-content: center;
	&:disabled {
		background-color: var(--gray-secondary);
		div {
			color: var(--gray-primary);
		}
		svg {
			stroke: var(--gray-primary);
		}
	}
	&.toggle {
		background-color: var(--black-primary);
		div {
			color: var(--white-primary);
		}
		svg {
			stroke: var(--white-primary);
		}
	}
`;

const RecordType = styled.div`
	align-items: center;
`;

const RecordNum = styled.div`
	font-size: 1.5rem;
`;

const RecordBtn = ({ type }) => {
	const dispatch = useDispatch();
	const recordingPlay = useSelector((state) => state.plays.recordingPlay);
	const player = recordingPlay.playerNum;
	const plays = useSelector((state) => state.plays.plays);
	const points = plays.filter(
		(play) => play.playerNum === player && play.typeNum === type.num
	).length;

	const handleClick = () => {
		dispatch(
			playsActions.setRecordOfPlay({
				typeNum: type.num,
				type: type.type,
				win: type.win,
			})
		);
	};

	return (
		<Container
			className={recordingPlay.typeNum === type.num ? "toggle" : ""}
			disabled={recordingPlay.playerNum === -1}
			onClick={handleClick}
		>
			<RecordType>{type.text}</RecordType>
			<RecordNum>{recordingPlay.playerNum === -1 ? "--" : points}</RecordNum>
			{type.win ? <HiOutlinePlusCircle /> : <HiOutlineMinusCircle />}
		</Container>
	);
};

export default RecordBtn;
