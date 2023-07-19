import styled from "@emotion/styled";

import { ReactComponent as PlayerIcon } from "../../images/user.svg";

const Container = styled.button`
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: grid;
	grid-template-columns: 3fr 2fr;
	grid-template-rows: 2fr repeat(2, minmax(0, 1fr));
	&.toggle {
		background-color: var(--black-primary);
		div {
			color: var(--white-primary);
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

const PlayerBtn = ({ index, player, play, setPlay }) => {
	const { number, name, role, point } = player;
	const handleToggle = () => {
		setPlay({
			...play,
			playerNum: index,
		});
	};

	return (
		<Container
			className={play.playerNum === index ? "toggle" : ""}
			onClick={handleToggle}
		>
			<Number>{number}</Number>
			<Name>{name}</Name>
			<Role>{role}</Role>
			<Points>{point} pts</Points>
			<Player>
				<PlayerIcon />
			</Player>
		</Container>
	);
};

export default PlayerBtn;
