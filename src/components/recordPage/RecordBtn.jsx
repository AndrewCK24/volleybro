import { useSelector } from "react-redux";
import styled from "@emotion/styled";

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

const RecordBtn = ({ type, play, setPlay }) => {
	const plays = useSelector((state) => state.plays.plays);

	const handleClick = () => {
		if (play.typeNum === type.num) {
			setPlay({
				...play,
				typeNum: -1,
			});
			return;
		}

		let newScoreOppo = plays[plays.length - 1].scoreOppo;
		let newScoreOurs = plays[plays.length - 1].scoreOurs;
		if (type.win) {
			newScoreOurs++;
		} else {
			newScoreOppo++;
		}

		setPlay({
			...play,
			win: type.win,
			scoreOurs: newScoreOurs,
			scoreOppo: newScoreOppo,
			type: type.type,
			typeNum: type.num,
		});
	};

	return (
		<Container
			className={play.typeNum === type.num ? "toggle" : ""}
			disabled={play.playerNum === -1}
			onClick={handleClick}
		>
			<RecordType>{type.text}</RecordType>
			<RecordNum>3</RecordNum>
			{type.win ? <HiOutlinePlusCircle /> : <HiOutlineMinusCircle />}
		</Container>
	);
};

export default RecordBtn;
