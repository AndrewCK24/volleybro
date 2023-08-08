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
	const { records } = useSelector((state) => state.record.setData);
	const { playerNum } = useSelector((state) => state.record.data);
	const recordTypeArr =
		playerNum === null ? recordTypeOppoArr : recordTypeOursArr;
	const handleDisabled = (typeNum, position, isServing) => {
		const disabledArr = [];
		if (position !== 1) {
			disabledArr.push(1, 2);
		}
		if (isServing) {
			disabledArr.push(7, 11);
		} else if (position === 1) {
			disabledArr.push(1, 2);
		}
		if (position === 1 || position >= 5) {
			disabledArr.push(3, 4);
		}

		return disabledArr.includes(typeNum);
	};

	return (
		<Container className={playerNum === null ? "recordOppoBtnSet" : ""}>
			{recordTypeArr.map((type) => (
				<RecordBtn
					key={type.num}
					type={type}
					records={records}
					handleDisabled={handleDisabled}
					// layout={playerNum === null}
				/>
			))}
		</Container>
	);
};

export default RecordBtnSet;
