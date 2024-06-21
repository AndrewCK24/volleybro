import { Schema, model, models } from "mongoose";

const infoSchema = new Schema({
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
  role: { type: String, enum: ["", "C", "AC", "T", "M"], default: "" },
});

const matchSchema = new Schema(
  {
    win: { type: Boolean },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    info: { type: infoSchema },
    teams: {
      home: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Team",
        },
        name: { type: String },
      },
      away: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Team",
        },
        name: { type: String },
      },
    },
    rosters: {
      home: {
        players: [{ type: playerSchema }],
        staffs: [{ type: staffSchema }],
      },
      away: {
        players: [{ type: playerSchema }],
        staffs: [{ type: staffSchema }],
      },
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
        records: [{ type: Object }],
        lineup: { type: Object },
      },
    ],
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ team_id: 1 });

const Match = models.Match || model("Match", matchSchema, "matches");
export default Match;
