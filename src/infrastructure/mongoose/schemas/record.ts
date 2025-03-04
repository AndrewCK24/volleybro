import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";
import {
  MatchCategory,
  MatchDivision,
  MatchPhase,
  MoveType,
  Side,
  EntryType,
} from "@/entities/record";
import { lineupSchema, type LineupDocument } from "@/infrastructure/mongoose/schemas/team";

interface MatchDocument extends Document {
  _id: Types.ObjectId;
  name?: string;
  number?: number;
  phase?: MatchPhase;
  division?: MatchDivision;
  category?: MatchCategory;
  scoring: {
    setCount: number;
    decidingSetPoints: number;
  };
  location?: {
    city?: string;
    hall?: string;
  };
  time?: {
    date?: string;
    start?: string;
    end?: string;
  };
  weather?: {
    temperature: number;
  };
}

const matchSchema = new Schema<MatchDocument>({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String },
  number: { type: Number },
  phase: {
    type: Number,
    enum: MatchPhase,
    default: MatchPhase.NONE,
  },
  division: {
    type: Number,
    enum: MatchDivision,
    default: MatchDivision.NONE,
  },
  category: {
    type: Number,
    enum: MatchCategory,
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

interface PlayerStatsDocument extends Document {
  [MoveType.SERVING]: {
    success: number;
    error: number;
  };
  [MoveType.ATTACK]: {
    success: number;
    error: number;
  };
  [MoveType.BLOCKING]: {
    success: number;
    error: number;
  };
  [MoveType.RECEPTION]: {
    success: number;
    error: number;
  };
  [MoveType.DEFENSE]: {
    success: number;
    error: number;
  };
  [MoveType.SETTING]: {
    success: number;
    error: number;
  };
}

const playerStatsSchema = new Schema<PlayerStatsDocument>({
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

interface PlayerDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  number: number;
  stats: PlayerStatsDocument[];
}

const playerSchema = new Schema<PlayerDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  name: { type: String },
  number: { type: Number },
  stats: [{ type: playerStatsSchema }],
});

interface StaffDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  number: number;
  position: string;
}

const staffSchema = new Schema<StaffDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  name: { type: String },
  number: { type: Number },
  position: { type: String, enum: ["", "C", "AC", "T", "M"], default: "" },
});

interface TeamStatsDocument extends Document {
  [MoveType.SERVING]: { success: number; error: number };
  [MoveType.ATTACK]: { success: number; error: number };
  [MoveType.BLOCKING]: { success: number; error: number };
  [MoveType.RECEPTION]: { success: number; error: number };
  [MoveType.DEFENSE]: { success: number; error: number };
  [MoveType.SETTING]: { success: number; error: number };
  [MoveType.UNFORCED]: { success: number; error: number };
  rotation: number;
  timeout: number;
  substitution: number;
  challenge: number;
}

const teamStatsSchema = new Schema<TeamStatsDocument>({
  [MoveType.SERVING]: { success: { type: Number }, error: { type: Number } },
  [MoveType.ATTACK]: { success: { type: Number }, error: { type: Number } },
  [MoveType.BLOCKING]: { success: { type: Number }, error: { type: Number } },
  [MoveType.RECEPTION]: { success: { type: Number }, error: { type: Number } },
  [MoveType.DEFENSE]: { success: { type: Number }, error: { type: Number } },
  [MoveType.SETTING]: { success: { type: Number }, error: { type: Number } },
  [MoveType.UNFORCED]: { success: { type: Number }, error: { type: Number } },
  rotation: { type: Number },
  timeout: { type: Number },
  substitution: { type: Number },
  challenge: { type: Number },
});

interface TeamDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  players: PlayerDocument[];
  staffs: StaffDocument[];
  stats: TeamStatsDocument[];
  lineup: { [key: number]: Types.ObjectId };
}

const teamSchema = new Schema<TeamDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  name: { type: String },
  players: [{ type: playerSchema }],
  staffs: [{ type: staffSchema }],
  stats: [{ type: teamStatsSchema }],
  lineup: { type: lineupSchema },
});

interface RallyDetailDocument extends Document {
  score: number;
  type: MoveType;
  num: number;
  player: {
    _id: Types.ObjectId;
    zone: number;
  };
}

const rallyDetailSchema = new Schema<RallyDetailDocument>({
  score: { type: Number },
  type: { type: Number, enum: MoveType },
  num: { type: Number },
  player: {
    _id: { type: Schema.Types.ObjectId, ref: "Member" },
    zone: { type: Number },
  },
});

interface RallyDocument extends Document {
  win: boolean;
  home: RallyDetailDocument;
  away: RallyDetailDocument;
}

const rallySchema = new Schema<RallyDocument>({
  win: { type: Boolean },
  home: { type: rallyDetailSchema },
  away: { type: rallyDetailSchema },
});

const substitutionSchema = new Schema({
  team: { type: Number, enum: Side },
  players: {
    in: { type: Schema.Types.ObjectId, ref: "Member" },
    out: { type: Schema.Types.ObjectId, ref: "Member" },
  },
});

const timeoutSchema = new Schema({
  team: { type: Number, enum: Side },
});

const challengeSchema = new Schema({
  team: { type: Number, enum: Side },
  type: { type: String },
  success: { type: Boolean },
});

interface EntryDocument extends Document {
  type: EntryType;
  data: object;
}

const entrySchema = new Schema<EntryDocument>({
  type: { type: Number, enum: EntryType },
  data: { type: Schema.Types.Mixed },
});

interface SetDocument extends Document {
  win: boolean;
  lineups: {
    home: LineupDocument;
    away: LineupDocument;
  };
  options: {
    serve: Side;
    time: {
      start: string;
      end: string;
    };
  };
  entries: EntryDocument[];
}

const setSchema = new Schema<SetDocument>({
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
  entries: [{ type: entrySchema }],
});

export interface RecordDocument extends Document {
  win: boolean;
  team_id: Types.ObjectId;
  info: MatchDocument;
  teams: {
    home: LineupDocument;
    away: LineupDocument;
  };
  sets: SetDocument[];
}

const recordSchema = new Schema<RecordDocument>(
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

export const Record =
  (models.Record as Model<RecordDocument>) ||
  model<RecordDocument>("Record", recordSchema, "records");
export default Record;
