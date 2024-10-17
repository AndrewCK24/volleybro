import type { Rally } from "@/entities/record";

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

export type ReduxRecordState = {
  _id: string;
  win: boolean | null;
  status: ReduxStatus;
  isEditing?: boolean;
  recording: Rally;
};
