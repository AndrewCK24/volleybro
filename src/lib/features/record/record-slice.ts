import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import type { ScoringMove } from "@/src/lib/scoring-moves";
import type {
  ReduxStatus,
  ReduxLineup,
  ReduxRallyDetail,
  ReduxRecordInput,
} from "@/src/lib/features/record/types";
import { scoringMoves } from "@/src/lib/scoring-moves";

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
  recordingMode: "home",
};

const lineupState: ReduxLineup = {
  options: {
    liberoSwitchMode: 0,
    liberoSwitchPosition: "",
  },
  starting: [
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "",
      in: null,
      out: null,
    },
  ],
  liberos: [
    {
      _id: "",
      position: "L",
      in: null,
      out: null,
    },
    {
      _id: "",
      position: "L",
      in: null,
      out: null,
    },
  ],
  substitutes: [],
};

const rallyDetailState: ReduxRallyDetail = {
  score: 0,
  type: null,
  num: null,
  player: {
    _id: "",
    list: "",
    zone: 0,
  },
};

// TODO: Move to types.ts after splitting info to a separate slice
type RecordState = {
  _id: string;
  win: boolean | null;
  status: ReduxStatus;
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

const initialState: RecordState = {
  _id: "",
  win: null,
  status: statusState,
  lineups: {
    home: lineupState,
    away: lineupState,
  },
  recording: {
    win: null,
    home: rallyDetailState,
    away: rallyDetailState,
  },
};

// Define the reducers
export const initialize: CaseReducer<
  RecordState,
  PayloadAction<ReduxRecordInput>
> = (state, action) => {
  const record = structuredClone(action.payload);
  const setNum = record.sets.length - 1;
  const rallyNum = record.sets[setNum]?.rallies?.length || 0;
  const inPlay =
    !record.sets[setNum].hasOwnProperty("win") &&
    record.sets[setNum].hasOwnProperty("options");
  const isServing =
    inPlay || rallyNum === 0
      ? record.sets[setNum]?.options?.serve === "home"
      : record.sets[setNum].rallies[rallyNum - 1].win;
  const lineups = record.sets[setNum].lineups;
  const switchTargetIndex = lineups.home.starting.findIndex(
    (player, index) =>
      player.position === lineups.home.options.liberoSwitchPosition &&
      ((index === 0 && !isServing) || index >= 4)
  );
  if (inPlay) {
    if (switchTargetIndex !== -1) {
      const switchTarget = {
        ...lineups.home.starting[switchTargetIndex],
      };
      lineups.home.starting[switchTargetIndex] = lineups.home.liberos[0];
      lineups.home.liberos[0] = switchTarget;
    }
    const rotation = record.sets[setNum].counts.rotation % 6;
    if (rotation) {
      const rotatedPlayers = lineups.home.starting.splice(0, rotation);
      lineups.home.starting.push(...rotatedPlayers);
    }
  }
  state._id = record._id;
  state.status = {
    ...state.status,
    isServing,
    setNum,
    rallyNum,
    inPlay,
    scores: {
      home: record.sets[setNum].rallies[rallyNum - 1]?.home.score || 0,
      away: record.sets[setNum].rallies[rallyNum - 1]?.away.score || 0,
    },
    recordingMode: "home",
  };
  state.lineups = lineups;
};

export const setRecordingPlayer: CaseReducer<
  RecordState,
  PayloadAction<{ _id: string; list: string; zone: number }>
> = (state, action) => {
  state.status.recordingMode = "home";
  if (action.payload._id === state.recording.home.player._id) {
    state.recording = {
      ...initialState.recording,
      home: {
        ...initialState.recording.home,
        score: state.status.scores.home,
      },
      away: {
        ...initialState.recording.away,
        score: state.status.scores.away,
      },
    };
  } else {
    state.recording = {
      ...initialState.recording,
      home: {
        ...initialState.recording.home,
        player: {
          _id: action.payload._id,
          list: action.payload.list,
          zone: action.payload.zone,
        },
        score: state.status.scores.home,
      },
      away: {
        ...initialState.recording.away,
        score: state.status.scores.away,
      },
    };
  }
};

export const setRecordingHomeMove: CaseReducer<
  RecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { win, type, num, outcome } = action.payload;
  state.status.recordingMode = "away";
  state.recording = {
    ...state.recording,
    win: win,
    home: {
      ...state.recording.home,
      score: win ? state.status.scores.home + 1 : state.status.scores.home,
      type: type,
      num: num,
    },
    away: {
      ...state.recording.away,
      score: win ? state.status.scores.away : state.status.scores.away + 1,
      type: scoringMoves[outcome[0]].type,
      num: outcome[0],
    },
  };
};

export const setRecordingAwayMove: CaseReducer<
  RecordState,
  PayloadAction<ScoringMove>
> = (state, action) => {
  const { type, num } = action.payload;
  state.recording = {
    ...state.recording,
    away: {
      ...state.recording.away,
      type: type,
      num: num,
    },
  };
};

export const setRecordingMode: CaseReducer<
  RecordState,
  PayloadAction<"home" | "away">
> = (state, action) => {
  state.status.recordingMode = action.payload;
};

export const resetRecording: CaseReducer<RecordState> = (state) => {
  state.status = {
    ...state.status,
    isServing: state.recording.win,
    scores: {
      home: state.recording.home.score,
      away: state.recording.away.score,
    },
    rallyNum: state.status.rallyNum + 1,
    recordingMode: "home",
  };
  state.recording = {
    ...initialState.recording,
    home: {
      ...initialState.recording.home,
      score: state.status.scores.home,
    },
    away: {
      ...initialState.recording.away,
      score: state.status.scores.away,
    },
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
    // },
  },
});

export const recordActions = recordSlice.actions;

export default recordSlice.reducer;
