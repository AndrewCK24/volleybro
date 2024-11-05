import {
  createSlice,
  type CaseReducer,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  matchPhaseHelper,
  getPreviousRally,
} from "@/lib/features/record/helpers";

import {
  type Record,
  type Substitution,
  type Timeout,
  type Challenge,
  type RallyDetail,
  Side,
  EntryType,
  Rally,
} from "@/entities/record";
import type {
  ReduxRecordState,
  ReduxStatus,
} from "@/lib/features/record/types";
import { scoringMoves, type ScoringMove } from "@/lib/scoring-moves";

// Define the initial states
const statusState: ReduxStatus = {
  scores: { home: 0, away: 0 },
  setIndex: 0,
  entryIndex: 0,
  isServing: false,
  inProgress: false,
  isSetPoint: false,
  panel: "home",
};

const rallyDetailState: RallyDetail = {
  score: 0,
  type: null,
  num: null,
  player: { _id: "", zone: 0 },
};

export const initialState: ReduxRecordState = {
  _id: "",
  mode: "general",
  general: {
    status: statusState,
    recording: {
      win: null,
      home: rallyDetailState,
      away: rallyDetailState,
    },
  },
  editing: {
    status: statusState,
    recording: {
      win: null,
      home: rallyDetailState,
      away: rallyDetailState,
    },
  },
};

// Define the reducers
export const initialize: CaseReducer<
  ReduxRecordState,
  PayloadAction<Record>
> = (state, action) => {
  const record = action.payload;
  const setIndex = record.sets.length ? record.sets.length - 1 : 0;
  const entryIndex = record.sets[setIndex]?.entries?.length || 0;
  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  const { inProgress, isSetPoint } = matchPhaseHelper(
    record,
    setIndex,
    previousRally
  );
  const isServing = previousRally
    ? previousRally.win
    : record.sets[setIndex]?.options?.serve === "home";
  state._id = record._id;
  const status = {
    scores: {
      home: previousRally?.home?.score || 0,
      away: previousRally?.away?.score || 0,
    },
    setIndex,
    entryIndex,
    isServing,
    inProgress,
    isSetPoint,
    panel: "home" as ReduxStatus["panel"],
  };
  state.general.status = { ...state.general.status, ...status };
  state.editing.status = { ...state.editing.status, ...status };
};

export const setRecordMode: CaseReducer<
  ReduxRecordState,
  PayloadAction<ReduxRecordState["mode"]>
> = (state, action) => {
  state.mode = action.payload;
};

export const setRecordingPlayer: CaseReducer<
  ReduxRecordState,
  PayloadAction<{ _id: string; zone: number }>
> = (state, action) => {
  const { mode } = state;
  const { _id, zone } = action.payload;
  const isSamePlayer = _id === state[mode].recording.home.player._id;

  state[mode].status.panel = "home";
  state[mode].recording = {
    ...initialState[mode].recording,
    home: {
      ...initialState[mode].recording.home,
      player: isSamePlayer
        ? initialState[mode].recording.home.player
        : { _id, zone },
      score: state[mode].status.scores.home,
    },
    away: {
      ...initialState[mode].recording.away,
      score: state[mode].status.scores.away,
    },
  };
};

export const setRecordingHomeMove: CaseReducer<
  ReduxRecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { mode } = state;
  const { win, type, num, outcome } = action.payload;
  const { home, away } = state[mode].status.scores;

  state[mode].status.panel = "away";
  state[mode].recording.win = win;
  state[mode].recording.home = {
    ...state[mode].recording.home,
    score: win ? home + 1 : home,
    type,
    num,
  };
  state[mode].recording.away = {
    ...state[mode].recording.away,
    score: win ? away : away + 1,
    type: scoringMoves[outcome[0]].type,
    num: outcome[0],
  };
};

export const setRecordingAwayMove: CaseReducer<
  ReduxRecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { mode } = state;
  const { type, num } = action.payload;
  state[mode].recording.away = { ...state[mode].recording.away, type, num };
};

export const confirmRecordingRally: CaseReducer<
  ReduxRecordState,
  PayloadAction<Record>
> = (state, action) => {
  const record = structuredClone(action.payload);
  const { mode } = state;
  const { setIndex, entryIndex } = state[mode].status;
  const { inProgress, isSetPoint } = matchPhaseHelper(
    record,
    setIndex,
    state[mode].recording
  );

  state[mode].status = {
    ...state[mode].status,
    scores: {
      home: state[mode].recording.home.score,
      away: state[mode].recording.away.score,
    },
    entryIndex: entryIndex + 1,
    isServing: state[mode].recording.win,
    inProgress,
    isSetPoint,
    panel: "home",
  };

  state[mode].recording = {
    ...initialState[mode].recording,
    home: {
      ...initialState[mode].recording.home,
      score: state[mode].status.scores.home,
    },
    away: {
      ...initialState[mode].recording.away,
      score: state[mode].status.scores.away,
    },
  };
};

export const setRecordingSubstitution: CaseReducer<
  ReduxRecordState,
  PayloadAction<string>
> = (state, action) => {
  const { mode } = state;
  const inPlayer = action.payload;
  const { _id: outPlayer } = state[mode].recording.home.player;
  state[mode].recording = {
    ...state[mode].recording,
    substitution: {
      team: Side.HOME,
      players: { in: inPlayer, out: outPlayer },
    },
  };
};

export const resetRecordingSubstitution: CaseReducer<ReduxRecordState> = (
  state
) => {
  const { mode } = state;
  const { substitution, ...rest } = state[mode].recording;
  state[mode].recording = { ...rest };
  state[mode].status.panel = "home";
};

export const confirmRecordingSubstitution: CaseReducer<ReduxRecordState> = (
  state
) => {
  const { mode } = state;
  state[mode].status.panel = "home";
  state[mode].status.entryIndex += 1;
  state[mode].recording = {
    ...initialState[mode].recording,
    home: {
      ...initialState[mode].recording.home,
      score: state[mode].status.scores.home,
    },
    away: {
      ...initialState[mode].recording.away,
      score: state[mode].status.scores.away,
    },
  };
};

export const setPanel: CaseReducer<
  ReduxRecordState,
  PayloadAction<ReduxStatus["panel"]>
> = (state, action) => {
  const { mode } = state;
  state[mode].status.panel = action.payload;
};

export const resetRecording: CaseReducer<ReduxRecordState> = (state) => {
  const { mode } = state;
  state[mode].status.panel = "home";
  state[mode].recording = {
    ...initialState[mode].recording,
    home: {
      ...initialState[mode].recording.home,
      score: state[mode].status.scores.home,
    },
    away: {
      ...initialState[mode].recording.away,
      score: state[mode].status.scores.away,
    },
  };
};

const setSetIndex: CaseReducer<ReduxRecordState, PayloadAction<number>> = (
  state,
  action
) => {
  const { mode } = state;
  state[mode].status.setIndex = action.payload;
};

// TODO: 修正編輯狀態之 isSetPoint 計算邏輯
const setEditingEntryStatus: CaseReducer<
  ReduxRecordState,
  PayloadAction<{ record: Record; entryIndex: number }>
> = (state, action) => {
  const { record, entryIndex } = action.payload;
  const { setIndex } = state.editing.status;

  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  const entry = record.sets[setIndex].entries[entryIndex];

  state.mode = "editing";
  state.editing.recording = {
    win:
      entry.type === EntryType.RALLY
        ? (entry.data as Rally).win
        : state.editing.recording.win,
    home:
      entry.type === EntryType.RALLY
        ? (entry.data as Rally).home
        : state.editing.recording.home,
    away:
      entry.type === EntryType.RALLY
        ? (entry.data as Rally).away
        : state.editing.recording.away,
    ...(entry.type === EntryType.SUBSTITUTION
      ? { substitution: entry.data as Substitution }
      : entry.type === EntryType.TIMEOUT
      ? { timeout: entry.data as Timeout }
      : entry.type === EntryType.CHALLENGE
      ? { challenge: entry.data as Challenge }
      : entry.data),
  };
  state.editing.status = {
    ...state.editing.status,
    isServing: previousRally
      ? previousRally.win
      : record.sets[setIndex].options.serve === "home",
    scores: {
      home: previousRally ? previousRally.home.score : 0,
      away: previousRally ? previousRally.away.score : 0,
    },
    entryIndex,
    inProgress: true,
    isSetPoint: false,
    panel: entry.type === EntryType.SUBSTITUTION ? "substitutes" : "away",
  };
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    initialize,
    setRecordMode,
    setRecordingPlayer,
    setRecordingHomeMove,
    setRecordingAwayMove,
    confirmRecordingRally,
    setRecordingSubstitution,
    resetRecordingSubstitution,
    confirmRecordingSubstitution,
    setPanel,
    resetRecording,
    setSetIndex,
    setEditingEntryStatus,
  },
});

export const recordActions = recordSlice.actions;
export type RecordActions = typeof recordActions;

export default recordSlice.reducer;
