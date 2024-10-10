export enum StartingPosition {
  OH = "OH",
  MB = "MB",
  OP = "OP",
  S = "S",
}

export enum LiberoPosition {
  L = "L",
}

export type Lineup = {
  options: {
    liberoSwitchMode: 0 | 1 | 2;
    liberoSwitchPosition: "" | "OH" | "MB" | "OP";
  };
  starting: {
    _id: string;
    position: "" | StartingPosition;
    in: number;
    out: number;
  }[];
  liberos: {
    _id: string;
    position: "" | LiberoPosition;
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

export type Player = {
  _id: string;
  name: string;
  number: number;
  stats: PlayerStats[];
};

export type Staff = {
  _id: string;
  name: string;
  number: number;
  position: "" | "C" | "AC" | "T" | "M";
};

export type TeamStats = PlayerStats & {
  [MoveType.UNFORCED]: { success: number; error: number };
  rotation: number;
  timeout: number;
  substitution: number;
  challenge: number;
};

export type Team = {
  _id: string;
  name: string;
  players: Player[];
  staffs: Staff[];
  stats: TeamStats[];
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
  challenges: {
    team_id: string;
    type: string;
    success: boolean;
  }[];
  timeouts: {
    team_id: string;
  }[];
  substitutions: {
    team_id: string;
    players: {
      in: string;
      out: string;
    };
  }[];
};

export type Set = {
  win: boolean;
  lineups: {
    home: Lineup;
    away: Lineup;
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
