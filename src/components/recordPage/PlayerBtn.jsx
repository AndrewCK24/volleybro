import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { playsActions } from "../../store/plays-slice";

const Container = styled.button`
	min-height: 5.5rem;
	padding: 0.5rem;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-template-rows: 3fr 1fr;
	&.toggle {
		background-color: var(--black-primary);
		div {
			color: var(--white-primary);
			border-color: var(--white-primary);
		}
		svg {
			stroke: var(--white-primary);
		}
	}
`;

const Number = styled.div`
	grid-column: 1;
	grid-row: 1;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 3rem;
	font-weight: 700;
`;

const Name = styled.div`
	font-size: 1.5rem;
	grid-column: 1;
	grid-row: 2;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
`;

const Role = styled.div`
	grid-column: 2;
	grid-row: 2;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
`;

const SetInfo = styled.div`
	height: 100%;
	grid-column: 2;
	grid-row: 1;
	display: flex;
	flex-direction: column;
`;

const Substitute = styled.div`
	flex: 2 1;
	border: 1px solid var(--black-primary);
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	font-weight: 500;
`;

const Points = styled.div`
	flex: 1 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const PlayerBtn = ({ className, player }) => {
	const dispatch = useDispatch();
	const plays = useSelector((state) => state.plays.plays);
	const recordingPlay = useSelector((state) => state.plays.recordingPlay);
	const memberArr = useSelector((state) => state.team.members);
	const { starting, substitute, isSub } = player;
	const { number, name, role } = memberArr.find((member) => {
		return isSub ? member.number === substitute : member.number === starting;
	});
	const points = [
		plays.filter((play) => play.playerNum === number && play.win).length,
		plays.filter((play) => play.playerNum === number && !play.win).length,
	];
	const handleToggle = () => {
		dispatch(playsActions.setPlayerOfPlay({ playerNum: number }));
	};

	return (
		<Container
			className={`${className} ${
				recordingPlay.playerNum === number ? "toggle" : ""
			}`}
			onClick={handleToggle}
		>
			<Number>{number}</Number>
			<Name>{name}</Name>
			<SetInfo>
				<Substitute>{substitute ? substitute : ""}</Substitute>
				<Points>+{points[0]}</Points>
				<Points>-{points[1]}</Points>
			</SetInfo>
			<Role>{role}</Role>
		</Container>
	);
};

export default PlayerBtn;
