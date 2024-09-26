import { Schema, model, models } from "mongoose";

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
    type: String,
    enum: ["", "elim", "seed", "qual", "final"],
    default: "",
  },
  division: {
    type: String,
    enum: ["", "men", "women", "mixed"],
    default: "",
  },
  category: {
    type: String,
    enum: ["", "senior", "junior", "youth"],
    default: "",
  },
  scoring: {
    setCount: { type: Number },
    decidingSetPoints: { type: Number },
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

const statisticsSchema = new Schema({
  serving: {
    success: { type: Number },
    error: { type: Number },
  },
  attacking: {
    success: { type: Number },
    error: { type: Number },
  },
  blocking: {
    success: { type: Number },
    error: { type: Number },
  },
  receiving: {
    success: { type: Number },
    error: { type: Number },
  },
  digging: {
    success: { type: Number },
    error: { type: Number },
  },
  setting: {
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
  statistics: { type: statisticsSchema },
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

const teamSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  name: { type: String },
  players: [{ type: playerSchema }],
  staffs: [{ type: staffSchema }],
});

const rallyDetailSchema = new Schema({
  score: { type: Number },
  type: { type: Number },
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
