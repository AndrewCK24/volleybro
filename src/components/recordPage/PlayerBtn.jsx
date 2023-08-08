import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";

import { recordActions } from "../../store/record-slice";

const Container = styled.button`
	min-height: 5.5rem;
	padding: 0.5rem;
	border: 1px solid var(--black-primary);
	border-radius: 1rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	/* gap: 0.5rem; */
	&.toggle {
		background-color: var(--black-primary);
		div {
			color: var(--white-primary);
			border-color: var(--white-primary);
		}
	}
`;

const PlayerInfo = styled.div`
	flex: 3 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Number = styled.div`
	flex: 2 1;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 3rem;
	font-weight: 700;
`;

const Name = styled.div`
	flex: 1 1;
	font-size: 1.5rem;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
`;

const SetInfo = styled.div`
	flex: 1 1;
	padding-right: 1rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const PointsContainer = styled.div`
	flex: 2 1;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Point = styled.div`
	flex: 0 1;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
`;

const PointSign = styled.div`
	flex: 2 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
`;

const PointValue = styled.div`
	flex: 3 1;
	display: flex;
	align-items: center;
	justify-content: right;
	font-size: 1.25rem;
`;

const Role = styled.div`
	flex: 1 1;
	width: 100%;
	font-size: 1.5rem;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
`;

const LineupInfo = styled.div`
	flex: 1 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
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
	&.hidden {
		visibility: hidden;
	}
	&.unavailable {
		color: var(--gray-primary);
		text-decoration: line-through;
	}
`;

const PlayerBtn = ({ className, player, position }) => {
	const dispatch = useDispatch();
	const { starting, substitute, isSub } = player;
	const { playerNum } = useSelector((state) => state.record.data);
	const { records } = useSelector((state) => state.record.setData);
	const memberArr = useSelector((state) => state.team.members);
	const { number, name, role } = memberArr.find((member) => {
		return isSub ? member.number === substitute : member.number === starting;
	});
	const points = [
		records.filter((record) => record.playerNum === number && record.win)
			.length,
		records.filter((record) => record.playerNum === number && !record.win)
			.length,
	];
	const handleToggle = () => {
		dispatch(recordActions.setRecordingPlayer({ playerNum: number, position }));
	};

	return (
		<Container
			className={`
				${className}
				${playerNum === number ? "toggle" : ""}
			`}
			onClick={handleToggle}
		>
			<PlayerInfo>
				<Number>{number}</Number>
				<Name>{name}</Name>
			</PlayerInfo>
			<SetInfo>
				<PointsContainer>
					<Point>
						<PointSign>+</PointSign>
						<PointValue>{points[0]}</PointValue>
					</Point>
					<Point>
						<PointSign>-</PointSign>
						<PointValue>{points[1]}</PointValue>
					</Point>
				</PointsContainer>
				<Role>{role}</Role>
			</SetInfo>
			<LineupInfo>
				<Substitute
					className={`
						${isSub ? "" : "unavailable"}
						${substitute === null ? "hidden" : ""}
					`}
				>
					{substitute}
				</Substitute>
				<Substitute></Substitute>
				{/* <Substitute className="hidden"></Substitute> */}
			</LineupInfo>
		</Container>
	);
};

export default PlayerBtn;
