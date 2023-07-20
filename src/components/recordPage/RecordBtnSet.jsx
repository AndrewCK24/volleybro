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
	{
		text: "發球得分",
		type: "service",
		win: true,
		num: 0,
	},
	{
		text: "發球失誤",
		type: "service",
		win: false,
		num: 1,
	},
	{
		text: "攻擊得分",
		type: "attack",
		win: true,
		num: 2,
	},
	{
		text: "攻擊失誤",
		type: "attack",
		win: false,
		num: 3,
	},
	{
		text: "攔網得分",
		type: "block",
		win: true,
		num: 4,
	},
	{
		text: "攔網失誤",
		type: "block",
		win: false,
		num: 5,
	},
	{
		text: "接發失誤",
		type: "receive",
		win: false,
		num: 6,
	},
	{
		text: "防守失誤",
		type: "defense",
		win: false,
		num: 7,
	},
	{
		text: "二傳失誤",
		type: "set",
		win: false,
		num: 8,
	},
	{
		text: "犯規",
		type: "fault",
		win: false,
		num: 9,
	}
];

const RecordBtnSet = ({ play, setPlay }) => {
	return (
		<Container>
			{typeArr.map((type, index) => (
				<RecordBtn key={index} type={type} play={play} setPlay={setPlay} />
			))}
		</Container>
	);
};

export default RecordBtnSet;
