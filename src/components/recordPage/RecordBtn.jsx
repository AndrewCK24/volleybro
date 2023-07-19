import styled from "@emotion/styled";

import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";

const Container = styled.button`
	display: grid;
	grid-template-columns: 3fr 1fr 1fr;
	column-gap: 0.25rem;
	border: 1px solid var(--black-primary);
	border-radius: 0.5rem;
  font-size: 1.25rem;
  align-items: center;
  justify-content: center;
`;

const RecordType = styled.div`
	align-items: center;
`;

const RecordNum = styled.div`
	font-size: 1.5rem;
`;

const RecordBtn = ({ type }) => {
	return (
		<Container>
			<RecordType>{type}</RecordType>
			<RecordNum>3</RecordNum>
			<HiOutlinePlusCircle />
		</Container>
	);
};

export default RecordBtn;
