import type { Position } from "@/entities/record";
import type { MoveType } from "@/entities/record";

// For Forms and Tables
export type FormMatch = {
  _id?: string;
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
  isSetPoint: boolean;
  recordingMode: "home" | "away";
};

export type ReduxLineup = {
  options: {
    liberoSwitchMode: number;
    liberoSwitchPosition: string;
  };
  starting: {
    _id: string;
    position: Position;
    in: number | null;
    out: number | null;
  }[];
  liberos: {
    _id: string;
    position: Position;
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
    zone: number;
  };
};

export type ReduxRecording = {
  win: boolean;
  home: ReduxRallyDetail;
  away: ReduxRallyDetail;
};

export type ReduxRecordState = {
  _id: string;
  win: boolean | null;
  status: ReduxStatus;
  isEditing?: boolean;
  lineups: {
    home: ReduxLineup;
    away?: ReduxLineup;
  };
  recording: {
    win: boolean | null;
    home: ReduxRallyDetail;
    away: ReduxRallyDetail;
  };
};
