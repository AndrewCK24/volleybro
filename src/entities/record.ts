export enum Position {
  NONE = "",
  OH = "OH",
  MB = "MB",
  OP = "OP",
  S = "S",
  L = "L",
}

export type Lineup = {
  options: {
    liberoSwitchMode: 0 | 1 | 2;
    liberoSwitchPosition: "" | "OH" | "MB" | "OP";
  };
  starting: {
    _id: string;
    position: Position;
    in: number;
    out: number;
  }[];
  liberos: {
    _id: string;
    position: Position;
    in: number;
    out: number;
  }[];
  substitutes: {
    _id: string;
    sub_id: string;
  }[];
};

export enum MatchPhase {
  NONE,
  ELIM,
  SEED,
  QUAL,
  FINAL,
}
export enum MatchDivision {
  NONE,
  MEN,
  WOMEN,
  MIXED,
}
export enum MatchCategory {
  NONE,
  SENIOR,
  JUNIOR,
  YOUTH,
}

export type Match = {
  _id: string;
  name: string;
  number: number;
  phase: MatchPhase;
  division: MatchDivision;
  category: MatchCategory;
  scoring: {
    setCount: number;
    decidingSetPoints: number;
  };
  location: {
    city: string;
    hall: string;
  };
  time: {
    date: string;
    start: string;
    end: string;
  };
  weather: {
    temperature: number;
  };
};

export enum MoveType {
  SERVING = 1,
  BLOCKING,
  ATTACK,
  RECEPTION,
  DEFENSE,
  SETTING,
  UNFORCED,
}

type PlayerStatsMoveType = Exclude<MoveType, MoveType.UNFORCED>;

export type PlayerStats = {
  [key in PlayerStatsMoveType]: {
    success: number;
    error: number;
  };
};

export class PlayerStatsClass implements PlayerStats {
  [MoveType.SERVING]: { success: number; error: number };
  [MoveType.BLOCKING]: { success: number; error: number };
  [MoveType.ATTACK]: { success: number; error: number };
  [MoveType.RECEPTION]: { success: number; error: number };
  [MoveType.DEFENSE]: { success: number; error: number };
  [MoveType.SETTING]: { success: number; error: number };

  constructor() {
    this[MoveType.SERVING] = { success: 0, error: 0 };
    this[MoveType.BLOCKING] = { success: 0, error: 0 };
    this[MoveType.ATTACK] = { success: 0, error: 0 };
    this[MoveType.RECEPTION] = { success: 0, error: 0 };
    this[MoveType.DEFENSE] = { success: 0, error: 0 };
    this[MoveType.SETTING] = { success: 0, error: 0 };
  }
}

export type Player = {
  _id: string;
  name: string;
  number: number;
  stats: PlayerStats[];
};

export type TeamStats = PlayerStats & {
  [MoveType.UNFORCED]: { success: number; error: number };
  rotation: number;
  timeout: number;
  substitution: number;
  challenge: number;
};

export class TeamStatsClass implements TeamStats {
  [MoveType.SERVING]: { success: number; error: number };
  [MoveType.BLOCKING]: { success: number; error: number };
  [MoveType.ATTACK]: { success: number; error: number };
  [MoveType.RECEPTION]: { success: number; error: number };
  [MoveType.DEFENSE]: { success: number; error: number };
  [MoveType.SETTING]: { success: number; error: number };
  [MoveType.UNFORCED]: { success: number; error: number };
  rotation: number;
  timeout: number;
  substitution: number;
  challenge: number;

  constructor() {
    this[MoveType.SERVING] = { success: 0, error: 0 };
    this[MoveType.BLOCKING] = { success: 0, error: 0 };
    this[MoveType.ATTACK] = { success: 0, error: 0 };
    this[MoveType.RECEPTION] = { success: 0, error: 0 };
    this[MoveType.DEFENSE] = { success: 0, error: 0 };
    this[MoveType.SETTING] = { success: 0, error: 0 };
    this[MoveType.UNFORCED] = { success: 0, error: 0 };
    this.rotation = 0;
    this.timeout = 2;
    this.substitution = 6;
    this.challenge = 2;
  }
}

export type Staff = {
  _id: string;
  name: string;
  number: number;
  position: "" | "C" | "AC" | "T" | "M";
};

export type Team = {
  _id: string;
  name: string;
  players: Player[];
  staffs: Staff[];
  stats: TeamStats[];
  lineup?: Lineup;
};

export type RallyDetail = {
  score: number;
  type: MoveType;
  num: number;
  player: {
    _id: string;
    zone: number;
  };
};

export type Rally = {
  win: boolean;
  home: RallyDetail;
  away: RallyDetail;
  challenges?: {
    team_id: string;
    type: string;
    success: boolean;
  }[];
  timeouts?: {
    team_id: string;
  }[];
  substitutions?: {
    team_id: string;
    players?: {
      in: string;
      out: string;
    };
  }[];
};

export type Set = {
  win: boolean;
  lineups: {
    home: Lineup;
    away?: Lineup;
  };
  options: {
    serve: "home" | "away";
    time: {
      start: string;
      end: string;
    };
  };
  rallies: Rally[];
};

export type Record = {
  _id: string;
  win: boolean;
  team_id: string;
  info: Match;
  teams: {
    home: Team;
    away: Team;
  };
  sets: Set[];
  createdAt?: Date;
  updatedAt?: Date;
};
