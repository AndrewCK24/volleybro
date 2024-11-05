import {
  createSlice,
  type CaseReducer,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  matchPhaseHelper,
  getPreviousRally,
} from "@/lib/features/record/helpers";

import { type Record, type RallyDetail, Side } from "@/entities/record";
import type {
  ReduxRecordState,
  ReduxStatus,
} from "@/lib/features/record/types";
import { scoringMoves, type ScoringMove } from "@/lib/scoring-moves";

// Define the initial states
const statusState: ReduxStatus = {
  isServing: false,
  scores: { home: 0, away: 0 },
  setIndex: 0,
  entryIndex: 0,
  inPlay: false,
  isSetPoint: false,
  recordingMode: "home",
};

const rallyDetailState: RallyDetail = {
  score: 0,
  type: null,
  num: null,
  player: { _id: "", zone: 0 },
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
  const entryIndex = record.sets[setIndex]?.entries?.length || 0;
  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  const { inPlay, isSetPoint } = matchPhaseHelper(
    record,
    setIndex,
    previousRally
  );
  const isServing = previousRally
    ? previousRally.win
    : record.sets[setIndex]?.options?.serve === "home";
  state._id = record._id;
  state.status = {
    ...state.status,
    isServing,
    scores: {
      home: previousRally?.home?.score || 0,
      away: previousRally?.away?.score || 0,
    },
    setIndex,
    entryIndex,
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

export const confirmRecordingRally: CaseReducer<
  ReduxRecordState,
  PayloadAction<Record>
> = (state, action) => {
  const record = structuredClone(action.payload);
  const { setIndex, entryIndex } = state.status;
  const { inPlay, isSetPoint } = matchPhaseHelper(
    record,
    setIndex,
    state.recording
  );

  state.status = {
    ...state.status,
    isServing: state.recording.win,
    scores: {
      home: state.recording.home.score,
      away: state.recording.away.score,
    },
    entryIndex: entryIndex + 1,
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

export const setRecordingSubstitution: CaseReducer<
  ReduxRecordState,
  PayloadAction<string>
> = (state, action) => {
  const inPlayer = action.payload;
  const { _id: outPlayer } = state.recording.home.player;
  state.recording = {
    ...state.recording,
    substitution: {
      team: Side.HOME,
      players: { in: inPlayer, out: outPlayer },
    },
  };
};

export const resetRecordingSubstitution: CaseReducer<ReduxRecordState> = (
  state
) => {
  const { substitution, ...rest } = state.recording;
  state.recording = { ...rest };
  state.status.recordingMode = "home";
};

export const confirmRecordingSubstitution: CaseReducer<ReduxRecordState> = (
  state
) => {
  state.status.recordingMode = "home";
  state.status.entryIndex += 1;
  state.recording = {
    ...initialState.recording,
    home: { ...initialState.recording.home, score: state.status.scores.home },
    away: { ...initialState.recording.away, score: state.status.scores.away },
  };
};

export const setRecordingMode: CaseReducer<
  ReduxRecordState,
  PayloadAction<ReduxStatus["recordingMode"]>
> = (state, action) => {
  state.status.recordingMode = action.payload;
};

export const resetRecording: CaseReducer<ReduxRecordState> = (state) => {
  state.status.recordingMode = "home";
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
    confirmRecordingRally,
    setRecordingSubstitution,
    resetRecordingSubstitution,
    confirmRecordingSubstitution,
    setRecordingMode,
    resetRecording,
  },
});

export const recordActions = recordSlice.actions;
export type RecordActions = typeof recordActions;

export default recordSlice.reducer;
