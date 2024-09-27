import { MoveType } from "@/src/entities/record";

export type ScoringMove = {
  num: number;
  win: boolean;
  type: MoveType;
  text: string;
  outcome: number[];
};

export { MoveType };

export const scoringMoves: ScoringMove[] = [
  {
    num: 0,
    win: true,
    type: MoveType.Serving,
    text: "發球",
    outcome: [6],
  },
  {
    num: 1,
    win: false,
    type: MoveType.Serving,
    text: "發球",
    outcome: [9],
  },
  {
    num: 2,
    win: true,
    type: MoveType.Blocking,
    text: "攔網",
    outcome: [5],
  },
  {
    num: 3,
    win: false,
    type: MoveType.Blocking,
    text: "攔網",
    outcome: [4, 10],
  },
  {
    num: 4,
    win: true,
    type: MoveType.Attack,
    text: "攻擊",
    outcome: [3, 7],
  },
  {
    num: 5,
    win: false,
    type: MoveType.Attack,
    text: "攻擊",
    outcome: [2, 11],
  },
  {
    num: 6,
    win: false,
    type: MoveType.Reception,
    text: "接發",
    outcome: [0, 12],
  },
  {
    num: 7,
    win: false,
    type: MoveType.Defense,
    text: "防守",
    outcome: [4, 13],
  },
  {
    num: 8,
    win: false,
    type: MoveType.Setting,
    text: "二傳",
    outcome: [14],
  },
  {
    num: 9,
    win: true,
    type: MoveType.OppoError,
    text: "發球",
    outcome: [1],
  },
  {
    num: 10,
    win: true,
    type: MoveType.OppoError,
    text: "攔網",
    outcome: [3],
  },
  {
    num: 11,
    win: true,
    type: MoveType.OppoError,
    text: "攻擊",
    outcome: [5],
  },
  {
    num: 12,
    win: true,
    type: MoveType.OppoError,
    text: "輪轉",
    outcome: [6],
  },
  {
    num: 13,
    win: true,
    type: MoveType.OppoError,
    text: "防守",
    outcome: [7],
  },
  {
    num: 14,
    win: true,
    type: MoveType.OppoError,
    text: "二傳",
    outcome: [8],
  },
];

export const frontMoves: ScoringMove[] = scoringMoves.slice(2, 9);

export const backMoves: ScoringMove[] = scoringMoves
  .slice(0, 2)
  .concat(scoringMoves.slice(4, 9));

export const errorMoves: ScoringMove[] = scoringMoves.slice(9);
