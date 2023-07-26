import styled from "@emotion/styled";

import RecordBtn from "./RecordBtn";
import { typeArr } from "../../utils/playTypeArr";

const Container = styled.div`
	/* width: 100%;
	height: 100%; */
	flex: 1 1;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(6, minmax(0, 1fr));
	row-gap: 1rem;
	column-gap: 1rem;
`;

const RecordBtnSet = () => {
	return (
		<Container>
			{typeArr.map((type, index) => (
				<RecordBtn key={index} type={type} />
			))}
		</Container>
	);
};

export default RecordBtnSet;
