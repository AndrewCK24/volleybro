import { createSlice } from "@reduxjs/toolkit";
import { rallyOutcomes } from "@/lib/rally-outcomes";

const infoState = {
  name: "",
  number: 0,
  phase: "", // 可選值 ["", "elim", "seed", "qual", "final"]
  division: "", // 可選值 ["", "men", "women", "mixed"]
  category: "", // 可選值 ["", "senior", "junior", "youth"]
  scoring: {
    setCount: 0,
    decidingSetPoints: 0,
  },
  location: {
    city: "",
    hall: "",
  },
  time: {
    date: "",
    start: "",
    end: "",
  },
};

const lineupsState = {
  home: {
    starting: [
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
    ],
    liberos: [
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
      {
        starting: "",
        position: "",
        in: null,
        out: null,
      },
    ],
  },
  away: {},
};

const initialState = {
  _id: "",
  win: null,
  info: infoState,
  status: {
    isServing: false,
    scores: {
      home: 0,
      away: 0,
    },
    setNum: 0,
    rallyNum: 0,
    inPlay: false,
  },
  lineups: lineupsState,
  sets: [
    {
      win: null,
      options: {
        serve: "",
        time: {
          start: "",
          end: "",
        },
      },
      counts: {
        rotation: 0,
        timeout: 0,
        substitution: 0,
        challenge: 0,
      },
      rallies: [],
    },
  ],
  recording: {
    win: null,
    home: {
      score: 0,
      type: "",
      num: null,
      player: { _id: "", list: "", zone: 0 },
    },
    away: {
      score: 0,
      type: "",
      num: null,
      // player: { _id: "", list: "", zone: 0 },
    },
  },
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    initialize: (state, action) => {
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
      state.info = record.info;
      state.status = {
        ...state.status,
        isServing,
        setNum,
        rallyNum,
        inPlay,
      };
      state.lineups = lineups;
    },
    setMatchInfo: (state, action) => {
      const matchInfo = action.payload;
      state.info = {
        ...state.info,
        ...matchInfo,
      };
    },
    setRecordingPlayer: (state, action) => {
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
    },
    setRecordingOursType: (state, action) => {
      const { win, type, num } = action.payload;
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
          type: initialState.recording.away.type,
          num: initialState.recording.away.num,
        },
      };
    },
    setRecordingOppoType: (state, action) => {
      const { type, num } = action.payload;
      if (num === state.recording.away.num) {
        state.recording = {
          ...state.recording,
          win: initialState.recording.win,
          home: {
            ...state.recording.home,
            score: state.status.scores.home,
            type: initialState.recording.home.type,
            num: initialState.recording.home.num,
          },
          away: {
            ...state.recording.away,
            score: state.status.scores.away,
            type: initialState.recording.away.type,
            num: initialState.recording.away.num,
          },
        };
      } else {
        state.recording = {
          ...state.recording,
          away: {
            ...state.recording.away,
            type: type,
            num: num,
          },
        };
      }
    },
    confirmRecording: (state) => {
      const { setNum, rallyNum } = state.status;
      state.sets[setNum].rallies[rallyNum] = state.recording;
      if (state.recording.win === true) {
        // if (state.recording.home.type === "oppo-error") {
        //   state.players.away[state.recording.away.type].error[setNum] += 1;
        // } else {
        //   state.players[state.recording.home.player][
        //     state.recording.home.type
        //   ].successful[setNum] += 1;
        // }
        if (!state.status.isServing) {
          const servingPlayer = state.lineups.home.starting.shift();
          state.lineups.home.starting.push(servingPlayer);
          if (state.lineups.home.starting[3].position === "L") {
            const frontRowL = {
              ...state.lineups.home.starting[3],
            };
            state.lineups.home.starting[3] = state.lineups.home.liberos[0];
            state.lineups.home.liberos[0] = frontRowL;
          }
          state.sets[setNum].counts.rotation += 1;
        }
      } else if (state.recording.win === false) {
        // if (state.recording.away.type !== "oppo-error") {
        //   state.players.away[state.recording.away.type].successful[setNum] += 1;
        // } else {
        //   state.players[state.recording.home.player][
        //     state.recording.home.type
        //   ].error[setNum] += 1;
        // }
        if (state.status.isServing) {
          if (
            state.lineups.home.starting[0].position ===
            state.lineups.home.options.liberoSwitchPosition
          ) {
            const targetPayer = {
              ...state.lineups.home.starting[0],
            };
            state.lineups.home.starting[0] = state.lineups.home.liberos[0];
            state.lineups.home.liberos[0] = targetPayer;
          }
        }
      }
      state.status = {
        ...state.status,
        isServing: state.recording.win,
        scores: {
          home: state.recording.home.score,
          away: state.recording.away.score,
        },
        rallyNum: state.status.rallyNum + 1,
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
    },
  },
});

export const recordActions = recordSlice.actions;

export default recordSlice.reducer;
