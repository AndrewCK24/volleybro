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
  setNum: 0,
  rallyNum: 0,
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
  const setNum = record.sets.length ? record.sets.length - 1 : 0;
  const rallyNum = record.sets[setNum]?.rallies?.length || 0;
  const finalPoint = finalPointHelper(setNum, record.info);
  const { inPlay, isSetPoint } = matchPhaseHelper(
    record,
    record?.sets[setNum]?.rallies[rallyNum - 1],
    finalPoint
  );
  const isServing =
    inPlay || rallyNum === 0
      ? record.sets[setNum]?.options?.serve === "home"
      : record.sets[setNum].rallies[rallyNum - 1].win;
  state._id = record._id;
  state.status = {
    ...state.status,
    isServing,
    scores: {
      home: record?.sets[setNum]?.rallies[rallyNum - 1]?.home?.score || 0,
      away: record?.sets[setNum]?.rallies[rallyNum - 1]?.away?.score || 0,
    },
    setNum,
    rallyNum,
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
  const { setNum, rallyNum } = state.status;
  const finalPoint = finalPointHelper(setNum, record.info);
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
    rallyNum: rallyNum + 1,
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
