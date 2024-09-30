import type { Record } from "@/src/entities/record";
import type { MoveType } from "@/src/entities/record";

// For Redux
export type ReduxStatus = {
  isServing: boolean;
  scores: {
    home: number;
    away: number;
  };
  setNum: number;
  rallyNum: number;
  inPlay: boolean;
  recordingMode: "home" | "away";
};

export type ReduxLineup = {
  options: {
    liberoSwitchMode: number;
    liberoSwitchPosition: string;
  };
  starting: {
    _id: string;
    position: string;
    in: number | null;
    out: number | null;
  }[];
  liberos: {
    _id: string;
    position: string;
    in: number | null;
    out: number | null;
  }[];
  substitutes: {
    _id: string;
    sub_id: string;
  }[];
};

export type ReduxRallyDetail = {
  score: number;
  type: MoveType | null;
  num: number | null;
  player: {
    _id: string;
    list: string;
    zone: number;
  };
};

export type ReduxRecordInput = {
  _id: string;
  win: boolean;
  team_id: string;
  info: Record["info"];
  teams: {
    home: Record["teams"]["home"];
    away: Record["teams"]["away"];
  };
  sets: {
    win: boolean;
    lineups: {
      home: ReduxLineup;
      away: ReduxLineup;
    };
    options: {
      serve: "home" | "away";
      time: {
        start: string;
        end: string;
      };
    };
    counts: {
      rotation: number;
      timeout: number;
      substitution: number;
      challenge: number;
    };
    rallies: {
      win: boolean | null;
      home: ReduxRallyDetail;
      away: ReduxRallyDetail;
    }[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};
