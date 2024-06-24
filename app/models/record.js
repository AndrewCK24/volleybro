import { Schema, model, models } from "mongoose";
import { lineupSchema } from "@/app/models/team";

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
    sets: [
      {
        win: { type: Boolean },
        info: {
          firstServe: { type: Boolean },
          rotateCount: { type: Number },
          timeoutCount: { type: Number },
          substituteCount: { type: Number },
          challengeCount: { type: Number },
        },
        rallies: [{ type: Object }],
        lineup: { type: lineupSchema },
      },
    ],
  },
  {
    timestamps: true,
  }
);

recordSchema.index({ team_id: 1 });

const Record = models.Record || model("Record", recordSchema, "records");
export default Record;
