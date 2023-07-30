import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { playsActions } from "../../store/plays-slice";
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";

const Container = styled.button`
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	font-size: 1.5rem;
	align-items: center;
	justify-content: center;
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr;
	column-gap: 0.25rem;
	row-gap: 0.25rem;
	svg {
		width: 2rem;
		height: 2rem;
	}
	&.recordOppoBtn {
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr 1fr;
	}
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
	grid-column: 1 / span 2;
	font-size: 1.5rem;
	align-items: center;
`;

const RecordPts = styled.div`
	font-size: 1.5rem;
	font-weight: 700;
`;

const RecordBtn = ({ type }) => {
	const dispatch = useDispatch();
	const isServing = useSelector((state) => state.plays.isServing);
	const recordingPlay = useSelector((state) => state.plays.recordingPlay);
	const { playerNum, position, typeNum } = recordingPlay;
	const plays = useSelector((state) => state.plays.plays);
	const points = plays.filter(
		(play) => play.playerNum === playerNum && play.typeNum === type.num
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

	const handleDisabled = (typeNum) => {
		const disabledArr = [];
		if (position !== 1) {
			disabledArr.push(0, 1);
		}
		if (isServing) {
			disabledArr.push(6, 10);
		} else if (position === 1) {
			disabledArr.push(0, 1);
		}
		if (position === 1 || position >= 5) {
			disabledArr.push(2, 3);
		}

		return disabledArr.includes(typeNum);
	};

	return (
		<Container
			className={`
				${typeNum === type.num ? "toggle" : ""} 
				${playerNum === -1 ? "recordOppoBtn" : ""}
			`}
			disabled={handleDisabled(type.num)}
			onClick={handleClick}
		>
			<RecordType>{type.text}</RecordType>
			<RecordPts>{recordingPlay.playerNum === -1 ? "--" : points}</RecordPts>
			{type.win ? <HiOutlinePlusCircle /> : <HiOutlineMinusCircle />}
		</Container>
	);
};

export default RecordBtn;
