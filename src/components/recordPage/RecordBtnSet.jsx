import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import RecordBtn from "./RecordBtn";
import {
	recordTypeOursArr,
	recordTypeOppoArr,
} from "../../utils/recordTypeArr";

const Container = styled.div`
	flex: 1 1;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(6, minmax(0, 1fr));
	row-gap: 1rem;
	column-gap: 1rem;
	&.recordOppoBtnSet {
		grid-template-rows: 1fr 1fr 1fr;
	}
`;

const RecordBtnSet = () => {
	const recordingPlay = useSelector((state) => state.plays.recordingPlay);
	const recordTypeArr =
		recordingPlay.playerNum === -1 ? recordTypeOppoArr : recordTypeOursArr;
	return (
		<Container className={recordingPlay.playerNum === -1 ? "recordOppoBtnSet" : ""}>
			{recordTypeArr.map((type) => (
				<RecordBtn
					key={type.num}
					type={type}
					layout={recordingPlay.playerNum === -1}
				/>
			))}
		</Container>
	);
};

export default RecordBtnSet;
