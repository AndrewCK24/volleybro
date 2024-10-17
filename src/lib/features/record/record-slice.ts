import {
  createSlice,
  type CaseReducer,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  finalPointHelper,
  matchPhaseHelper,
} from "@/lib/features/record/helpers";

import type { Record, RallyDetail } from "@/entities/record";
import type {
  ReduxRecordState,
  ReduxStatus,
} from "@/lib/features/record/types";
import { scoringMoves, type ScoringMove } from "@/lib/scoring-moves";

// Define the initial states
const statusState: ReduxStatus = {
  isServing: false,
  scores: {
    home: 0,
    away: 0,
  },
  setIndex: 0,
  rallyIndex: 0,
  inPlay: false,
  isSetPoint: false,
  recordingMode: "home",
};

const rallyDetailState: RallyDetail = {
  score: 0,
  type: null,
  num: null,
  player: {
    _id: "",
    zone: 0,
  },
};

export const initialState: ReduxRecordState = {
  _id: "",
  win: null,
  status: statusState,
  recording: {
    win: null,
    home: rallyDetailState,
    away: rallyDetailState,
  },
};

// Define the reducers
export const initialize: CaseReducer<
  ReduxRecordState,
  PayloadAction<Record>
> = (state, action) => {
  const record = structuredClone(action.payload);
  const setIndex = record.sets.length ? record.sets.length - 1 : 0;
  const rallyIndex = record.sets[setIndex]?.rallies?.length || 0;
  const finalPoint = finalPointHelper(setIndex, record.info);
  const { inPlay, isSetPoint } = matchPhaseHelper(
    record,
    record?.sets[setIndex]?.rallies[rallyIndex - 1],
    finalPoint
  );
  const isServing =
    inPlay || rallyIndex === 0
      ? record.sets[setIndex]?.options?.serve === "home"
      : record.sets[setIndex].rallies[rallyIndex - 1].win;
  state._id = record._id;
  state.status = {
    ...state.status,
    isServing,
    scores: {
      home: record?.sets[setIndex]?.rallies[rallyIndex - 1]?.home?.score || 0,
      away: record?.sets[setIndex]?.rallies[rallyIndex - 1]?.away?.score || 0,
    },
    setIndex,
    rallyIndex,
    inPlay,
    isSetPoint,
    recordingMode: "home",
  };
};

export const setRecordingPlayer: CaseReducer<
  ReduxRecordState,
  PayloadAction<{ _id: string; zone: number }>
> = (state, action) => {
  const { _id, zone } = action.payload;
  const isSamePlayer = _id === state.recording.home.player._id;

  state.status.recordingMode = "home";
  state.recording = {
    ...initialState.recording,
    home: {
      ...initialState.recording.home,
      player: isSamePlayer ? initialState.recording.home.player : { _id, zone },
      score: state.status.scores.home,
    },
    away: {
      ...initialState.recording.away,
      score: state.status.scores.away,
    },
  };
};

export const setRecordingHomeMove: CaseReducer<
  ReduxRecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { win, type, num, outcome } = action.payload;
  const { home, away } = state.status.scores;

  state.status.recordingMode = "away";
  state.recording.win = win;
  state.recording.home = {
    ...state.recording.home,
    score: win ? home + 1 : home,
    type,
    num,
  };
  state.recording.away = {
    ...state.recording.away,
    score: win ? away : away + 1,
    type: scoringMoves[outcome[0]].type,
    num: outcome[0],
  };
};

export const setRecordingAwayMove: CaseReducer<
  ReduxRecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { type, num } = action.payload;
  state.recording.away = { ...state.recording.away, type, num };
};

export const setRecordingMode: CaseReducer<
  ReduxRecordState,
  PayloadAction<"home" | "away">
> = (state, action) => {
  state.status.recordingMode = action.payload;
};

export const resetRecording: CaseReducer<
  ReduxRecordState,
  PayloadAction<Record>
> = (state, action) => {
  const record = structuredClone(action.payload);
  const { setIndex, rallyIndex } = state.status;
  const finalPoint = finalPointHelper(setIndex, record.info);
  const { inPlay, isSetPoint } = matchPhaseHelper(
    record,
    state.recording,
    finalPoint
  );

  state.status = {
    ...state.status,
    isServing: state.recording.win,
    scores: {
      home: state.recording.home.score,
      away: state.recording.away.score,
    },
    rallyIndex: rallyIndex + 1,
    inPlay,
    isSetPoint,
    recordingMode: "home",
  };

  state.recording = {
    ...initialState.recording,
    home: { ...initialState.recording.home, score: state.status.scores.home },
    away: { ...initialState.recording.away, score: state.status.scores.away },
  };
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    initialize,
    setRecordingPlayer,
    setRecordingHomeMove,
    setRecordingAwayMove,
    setRecordingMode,
    resetRecording,
  },
});

export const recordActions = recordSlice.actions;
export type RecordActions = typeof recordActions;

export default recordSlice.reducer;
