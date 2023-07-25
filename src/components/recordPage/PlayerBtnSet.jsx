import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import PlayerBtn from "./PlayerBtn";

const Container = styled.div`
	flex: 1 1;
	/* grid-column: 1;
	grid-row: 1; */
	display: grid;
	grid-template-areas:
		"p5 p4"
		"p6 p3"
		"p1 p2";
	grid-gap: 1rem;
	.p1 {
		grid-area: p1;
	}
	.p2 {
		grid-area: p2;
	}
	.p3 {
		grid-area: p3;
	}
	.p4 {
		grid-area: p4;
	}
	.p5 {
		grid-area: p5;
	}
	.p6 {
		grid-area: p6;
	}
	/* TODO: 在我方發球時 first-of-child 以特殊色顯示 */
`;

const PlayerBtnSet = () => {
	const positionArr = ["p1", "p2", "p3", "p4", "p5", "p6"];
	const lineupArr = useSelector((state) => state.plays.lineup.ours);

	return (
		<Container>
			{lineupArr.map((player, index) => (
				<PlayerBtn
					className={positionArr[index]}
					key={index}
					player={player}
				/>
			))}
		</Container>
	);
};

export default PlayerBtnSet;
