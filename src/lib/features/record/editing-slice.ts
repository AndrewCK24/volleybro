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
  setRecordingMode,
  resetRecording,
} from "@/src/lib/features/record/record-slice";
import type {
  ReduxRecordState,
  ReduxLineup,
  ReduxStatus,
  ReduxRallyDetail,
  ReduxRecordInput,
} from "@/src/lib/features/record/types";

const initialState: ReduxRecordState = { isEditing: false, ...recordInitial };

const initialize: CaseReducer<
  ReduxRecordState,
  PayloadAction<ReduxRecordInput>
> = (state, action) => {
  recordInitialize(state, action);
  state.isEditing = false;
};

const setEditing: CaseReducer<ReduxRecordState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isEditing = action.payload;
};

const setSetNum: CaseReducer<ReduxRecordState, PayloadAction<number>> = (
  state,
  action
) => {
  state.status.setNum = action.payload;
};

interface SetEditingRallyStatusPayload {
  lineups: {
    home: ReduxLineup;
    away: ReduxLineup;
  };
  status: ReduxStatus;
  recording: {
    win: boolean | null;
    home: ReduxRallyDetail;
    away: ReduxRallyDetail;
  };
}

// FIXME: 修正編輯狀態 inPlay, isSetPoint 計算邏輯、減少引入參數
const setEditingRallyStatus: CaseReducer<
  ReduxRecordState,
  PayloadAction<SetEditingRallyStatusPayload>
> = (state, action) => {
  const { lineups, recording, ...status } = action.payload;
  state.isEditing = true;
  state.lineups = lineups;
  state.recording = recording;
  state.status = {
    ...state.status,
    ...status,
  };
};

const editingSlice = createSlice({
  name: "editing",
  initialState,
  reducers: {
    initialize,
    setEditing,
    setSetNum,
    setEditingRallyStatus,
    setRecordingPlayer,
    setRecordingHomeMove,
    setRecordingAwayMove,
    setRecordingMode,
    resetRecording,
  },
});

export const editingActions = editingSlice.actions;
export type EditingActions = typeof editingActions;
export default editingSlice.reducer;
