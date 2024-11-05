import {
  createSlice,
  type CaseReducer,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  initialState as recordInitial,
  initialize as recordInitialize,
  setRecordingPlayer,
  setRecordingHomeMove,
  setRecordingAwayMove,
  setRecordingSubstitution,
  resetRecordingSubstitution,
  confirmRecordingSubstitution,
  setRecordingMode,
  confirmRecordingRally,
  resetRecording,
} from "@/lib/features/record/record-slice";
import { getPreviousRally } from "@/lib/features/record/helpers";
import {
  type Record,
  type Substitution,
  type Timeout,
  type Challenge,
  EntryType,
} from "@/entities/record";
import type { ReduxRecordState } from "@/lib/features/record/types";

const initialState: ReduxRecordState = { isEditing: false, ...recordInitial };

const initialize: CaseReducer<ReduxRecordState, PayloadAction<Record>> = (
  state,
  action
) => {
  recordInitialize(state, action);
  state.isEditing = false;
};

const setEditing: CaseReducer<ReduxRecordState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isEditing = action.payload;
};

const setSetIndex: CaseReducer<ReduxRecordState, PayloadAction<number>> = (
  state,
  action
) => {
  state.status.setIndex = action.payload;
};

// TODO: 修正編輯狀態之 isSetPoint 計算邏輯
const setEditingEntryStatus: CaseReducer<
  ReduxRecordState,
  PayloadAction<{ record: Record; entryIndex: number }>
> = (state, action) => {
  const { record, entryIndex } = action.payload;
  const { setIndex } = state.status;

  const previousRally = getPreviousRally(record, setIndex, entryIndex);
  const entry = record.sets[setIndex].entries[entryIndex];

  state.isEditing = true;
  state.recording = {
    win: state.recording.win,
    home: state.recording.home,
    away: state.recording.away,
    ...(entry.type === EntryType.SUBSTITUTION
      ? { substitution: entry.data as Substitution }
      : entry.type === EntryType.TIMEOUT
      ? { timeout: entry.data as Timeout }
      : entry.type === EntryType.CHALLENGE
      ? { challenge: entry.data as Challenge }
      : entry.data),
  };
  state.status = {
    ...state.status,
    isServing: previousRally
      ? previousRally.win
      : record.sets[setIndex].options.serve === "home",
    scores: {
      home: previousRally ? previousRally.home.score : 0,
      away: previousRally ? previousRally.away.score : 0,
    },
    entryIndex,
    inPlay: true,
    isSetPoint: false,
    recordingMode:
      entry.type === EntryType.SUBSTITUTION ? "substitutes" : "away",
  };
};

const editingSlice = createSlice({
  name: "editing",
  initialState,
  reducers: {
    initialize,
    setEditing,
    setSetIndex,
    setEditingEntryStatus,
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

export const editingActions = editingSlice.actions;
export type EditingActions = typeof editingActions;
export default editingSlice.reducer;
