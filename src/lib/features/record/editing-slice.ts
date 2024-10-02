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
    // confirmRecording: (state) => {
    //   const { setNum, rallyNum } = state.status;
    //   state.sets[setNum].rallies[rallyNum] = state.recording;
    //   if (state.recording.win === true) {
    //     // if (state.recording.home.type === "oppo-error") {
    //     //   state.players.away[state.recording.away.type].error[setNum] += 1;
    //     // } else {
    //     //   state.players[state.recording.home.player][
    //     //     state.recording.home.type
    //     //   ].successful[setNum] += 1;
    //     // }
    //     if (!state.status.isServing) {
    //       const servingPlayer = state.lineups.home.starting.shift();
    //       state.lineups.home.starting.push(servingPlayer);
    //       if (state.lineups.home.starting[3].position === "L") {
    //         const frontRowL = {
    //           ...state.lineups.home.starting[3],
    //         };
    //         state.lineups.home.starting[3] = state.lineups.home.liberos[0];
    //         state.lineups.home.liberos[0] = frontRowL;
    //       }
    //       state.sets[setNum].counts.rotation += 1;
    //     }
    //   } else if (state.recording.win === false) {
    //     // if (state.recording.away.type !== "oppo-error") {
    //     //   state.players.away[state.recording.away.type].successful[setNum] += 1;
    //     // } else {
    //     //   state.players[state.recording.home.player][
    //     //     state.recording.home.type
    //     //   ].error[setNum] += 1;
    //     // }
    //     if (state.status.isServing) {
    //       if (
    //         state.lineups.home.starting[0].position ===
    //         state.lineups.home.options.liberoSwitchPosition
    //       ) {
    //         const targetPayer = {
    //           ...state.lineups.home.starting[0],
    //         };
    //         state.lineups.home.starting[0] = state.lineups.home.liberos[0];
    //         state.lineups.home.liberos[0] = targetPayer;
    //       }
    //     }
    //   }
    //   state.status = {
    //     ...state.status,
    //     isServing: state.recording.win,
    //     scores: {
    //       home: state.recording.home.score,
    //       away: state.recording.away.score,
    //     },
    //     rallyNum: state.status.rallyNum + 1,
    //   };
    //   state.recording = {
    //     ...initialState.recording,
    //     home: {
    //       ...initialState.recording.home,
    //       score: state.status.scores.home,
    //     },
    //     away: {
    //       ...initialState.recording.away,
    //       score: state.status.scores.away,
    //     },
    //   };
    //   state.isEditing = false;
    // },
  },
});

export const editingActions = editingSlice.actions;
export type EditingActions = typeof editingActions;
export default editingSlice.reducer;
