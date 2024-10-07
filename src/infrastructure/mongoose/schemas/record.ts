import { Schema, model, models } from "mongoose";
import {
  MatchCategory,
  MatchDivision,
  MatchPhase,
  MoveType,
} from "@/src/entities/record";

const lineupSchema = new Schema({
  options: {
    liberoSwitchMode: { type: Number, enum: [0, 1, 2], default: 0 },
    liberoSwitchPosition: {
      type: String,
      enum: ["", "OH", "MB", "OP"],
      default: "",
    },
  },
  starting: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
      position: { type: String, enum: ["OH", "MB", "OP", "S"] },
      in: { type: Number },
      out: { type: Number },
    },
  ],
  liberos: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
      position: { type: String, enum: ["L"] },
      in: { type: Number },
      out: { type: Number },
    },
  ],
  substitutes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
      sub_id: { type: Schema.Types.ObjectId, ref: "Member" },
    },
  ],
});

const matchSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String },
  number: { type: Number },
  phase: {
    type: Number,
    enum: Object.values(MatchPhase),
    default: MatchPhase.NONE,
  },
  division: {
    type: Number,
    enum: Object.values(MatchDivision),
    default: MatchDivision.NONE,
  },
  category: {
    type: Number,
    enum: Object.values(MatchCategory),
    default: MatchCategory.NONE,
  },
  scoring: {
    setCount: { type: Number, default: 3 },
    decidingSetPoints: { type: Number, default: 15 },
  },
  location: {
    city: { type: String },
    hall: { type: String },
  },
  time: {
    date: { type: String },
    start: { type: String },
    end: { type: String },
  },
  weather: {
    temperature: { type: Number },
  },
});

const playerStatsSchema = new Schema({
  [MoveType.SERVING]: {
    success: { type: Number },
    error: { type: Number },
  },
  [MoveType.ATTACK]: {
    success: { type: Number },
    error: { type: Number },
  },
  [MoveType.BLOCKING]: {
    success: { type: Number },
    error: { type: Number },
  },
  [MoveType.RECEPTION]: {
    success: { type: Number },
    error: { type: Number },
  },
  [MoveType.DEFENSE]: {
    success: { type: Number },
    error: { type: Number },
  },
  [MoveType.SETTING]: {
    success: { type: Number },
    error: { type: Number },
  },
});

const playerSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  name: { type: String },
  number: { type: Number },
  stats: [{ type: playerStatsSchema }],
});

const staffSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  name: { type: String },
  number: { type: Number },
  position: { type: String, enum: ["", "C", "AC", "T", "M"], default: "" },
});

const teamStatsSchema = new Schema({
  unforcedError: { type: Number },
  rotation: { type: Number },
  timeout: { type: Number },
  substitution: { type: Number },
  challenge: { type: Number },
});

const teamSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  name: { type: String },
  players: [{ type: playerSchema }],
  staffs: [{ type: staffSchema }],
  stats: [{ type: teamStatsSchema }],
});

const rallyDetailSchema = new Schema({
  score: { type: Number },
  type: { type: Number, enum: Object.values(MoveType) },
  num: { type: Number },
  player: {
    _id: { type: Schema.Types.ObjectId, ref: "Member" },
    zone: { type: Number },
  },
});

const rallySchema = new Schema({
  win: { type: Boolean },
  home: { type: rallyDetailSchema },
  away: { type: rallyDetailSchema },
  challenges: [
    {
      team_id: { type: Schema.Types.ObjectId, ref: "Team" },
      type: { type: String },
      success: { type: Boolean },
    },
  ],
  timeouts: [{ team_id: { type: Schema.Types.ObjectId, ref: "Team" } }],
  substitutions: [
    {
      team_id: { type: Schema.Types.ObjectId, ref: "Team" },
      players: {
        in: { type: Schema.Types.ObjectId, ref: "Member" },
        out: { type: Schema.Types.ObjectId, ref: "Member" },
      },
    },
  ],
});

const setSchema = new Schema({
  win: { type: Boolean },
  lineups: {
    home: { type: lineupSchema },
    away: { type: lineupSchema },
  },
  options: {
    serve: { type: String, enum: ["home", "away"] },
    time: {
      start: { type: String },
      end: { type: String },
    },
  },
  counts: {
    rotation: { type: Number, default: 0 },
    timeout: { type: Number, default: 2 },
    substitution: { type: Number, default: 6 },
    challenge: { type: Number, default: 2 },
  },
  rallies: [{ type: rallySchema }],
});

const recordSchema = new Schema(
  {
    win: { type: Boolean },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    info: { type: matchSchema },
    teams: {
      home: { type: teamSchema },
      away: { type: teamSchema },
    },
    sets: [{ type: setSchema }],
  },
  {
    timestamps: true,
  }
);

recordSchema.index({ team_id: 1 });

export const Record = models.Record || model("Record", recordSchema, "records");
export default Record;
