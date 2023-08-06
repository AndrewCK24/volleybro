export const recordTypeArr = [
	{
		text: "發球得分",
		type: "service",
		win: true,
		num: 1,
	},
	{
		text: "發球失誤",
		type: "service",
		win: false,
		num: 2,
	},
	{
		text: "攔網得分",
		type: "blocking",
		win: true,
		num: 3,
	},
	{
		text: "攔網失誤",
		type: "blocking",
		win: false,
		num: 4,
	},
	{
		text: "攻擊得分",
		type: "attack",
		win: true,
		num: 5,
	},
	{
		text: "攻擊失誤",
		type: "attack",
		win: false,
		num: 6,
	},
	{
		text: "接發失誤",
		type: "receive",
		win: false,
		num: 7,
	},
	{
		text: "防守失誤",
		type: "defense",
		win: false,
		num: 8,
	},
	{
		text: "二傳失誤",
		type: "setting",
		win: false,
		num: 9,
	},
	{
		text: "犯規",
		type: "fault",
		win: false,
		num: 10,
	},
	{
		text: "對方發球失誤",
		type: "service",
		win: true,
		num: 11,
	},
	{
		text: "對方攻擊失誤",
		type: "attack",
		win: true,
		num: 12,
	},
	{
		text: "對方傳球失誤",
		type: "defense",
		win: true,
		num: 13,
	},
	{
		text: "對方犯規",
		type: "fault",
		win: true,
		num: 14,
	},
];

export const recordTypeOursArr = recordTypeArr.slice(0, 10);

export const recordTypeOppoArr = recordTypeArr.slice(10);
