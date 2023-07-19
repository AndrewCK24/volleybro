import styled from "@emotion/styled";

import RecordBtn from "./RecordBtn";

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(6, minmax(0, 1fr));
	row-gap: 1rem;
	column-gap: 1rem;
`;

const typeArr = [
	"發球得分",
	"發球失誤",
	"攻擊得分",
	"攻擊失誤",
	"攔網得分",
	"攔網失誤",
	"接發失誤",
	"防守失誤",
	"二傳失誤",
	"犯規",
];

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
