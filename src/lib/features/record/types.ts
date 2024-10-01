import type { Record } from "@/src/entities/record";
import type { MoveType } from "@/src/entities/record";

// For Forms and Tables
export type FormMatch = {
  _id: string;
  name: string;
  number: number;
  phase: "0" | "1" | "2" | "3" | "4";
  division: "0" | "1" | "2" | "3";
  category: "0" | "1" | "2" | "3";
  scoring: {
    setCount: string;
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
    temperature: string;
  };
};

export type TableRosterPlayer = {
  _id: string;
  name: string;
  number: number;
  list: string;
};

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

export type ReduxRecordState = {
  _id: string;
  win: boolean | null;
  status: ReduxStatus;
  isEditing?: boolean;
  lineups: {
    home: ReduxLineup;
    away: ReduxLineup;
  };
  recording: {
    win: boolean | null;
    home: ReduxRallyDetail;
    away: ReduxRallyDetail;
  };
};
