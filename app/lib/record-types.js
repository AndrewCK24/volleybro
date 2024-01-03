export const recordTypes = [
  {
    num: 0,
    win: true,
    type: "serving",
    text: "發球",
    description: "發球得分",
    outcome: [6],
  },
  {
    num: 1,
    win: false,
    type: "serving",
    text: "發球",
    description: "發球失誤",
    outcome: [10],
  },
  {
    num: 2,
    win: true,
    type: "blocking",
    text: "攔網",
    description: "攔網得分",
    outcome: [5, 6, 7],
  },
  {
    num: 3,
    win: false,
    type: "blocking",
    text: "攔網",
    description: "攔網失誤",
    outcome: [4, 11],
  },
  {
    num: 4,
    win: true,
    type: "attack",
    text: "攻擊",
    description: "攻擊得分",
    outcome: [3, 7],
  },
  {
    num: 5,
    win: false,
    type: "attack",
    text: "攻擊",
    description: "攻擊失誤",
    outcome: [2, 13],
  },
  {
    num: 6,
    win: false,
    type: "reception",
    text: "接發",
    description: "接發失誤",
    outcome: [0],
  },
  {
    num: 7,
    win: false,
    type: "defense",
    text: "防守",
    description: "防守失誤",
    outcome: [4],
  },
  {
    num: 8,
    win: false,
    type: "setting",
    text: "二傳",
    description: "二傳失誤",
    outcome: [12],
  },
  {
    num: 9,
    win: false,
    type: "fault",
    text: "犯規",
    description: "犯規失誤",
    outcome: [14],
  },
  {
    num: 10,
    win: true,
    type: "oppo-error",
    text: "發球",
    description: "發球失誤",
    outcome: [1],
  },
  {
    num: 11,
    win: true,
    type: "oppo-error",
    text: "攔網",
    description: "攔網失誤",
    outcome: [3],
  },
  {
    num: 12,
    win: true,
    type: "oppo-error",
    text: "二傳",
    description: "二傳失誤",
    outcome: [8],
  },
  {
    num: 13,
    win: true,
    type: "oppo-error",
    text: "攻擊",
    description: "攻擊失誤",
    outcome: [5],
  },
  {
    num: 14,
    win: true,
    type: "oppo-error",
    text: "犯規",
    description: "犯規",
    outcome: [9],
  },
];

export const recordFrontTypes = recordTypes.slice(2, 10);

export const recordBackTypes = recordTypes
  .slice(0, 2)
  .concat(recordTypes.slice(4, 10));

export const recordErrorTypes = recordTypes.slice(10);
