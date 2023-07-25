import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { playsActions } from "../../store/plays-slice";
import { ReactComponent as PlayerIcon } from "../../images/user.svg";

const Container = styled.button`
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-template-rows: 2fr 1fr 1fr;
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
	grid-column: 1;
	grid-row: 2;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
`;

const Role = styled.div`
	grid-column: 2;
	grid-row: 2;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Points = styled.div`
	grid-column: 1;
	grid-row: 3;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Player = styled.div`
	grid-column: 2;
	grid-row: 3;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const PlayerBtn = ({ player }) => {
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
			className={recordingPlay.playerNum === number ? "toggle" : ""}
			onClick={handleToggle}
		>
			<Number>{number}</Number>
			<Name>{name}</Name>
			<Role>{role}</Role>
			<Points>
				+{points[0]} / -{points[1]}
			</Points>
			<Player>
				<PlayerIcon />
			</Player>
		</Container>
	);
};

export default PlayerBtn;
