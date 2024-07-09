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

const playerStats = {
  number: null,
  name: "",
  serving: {
    successful: [0],
    error: [0],
  },
  blocking: {
    successful: [0],
    error: [0],
  },
  attack: {
    successful: [0],
    error: [0],
  },
  reception: {
    successful: [0],
    error: [0],
  },
  defense: {
    successful: [0],
    error: [0],
  },
  setting: {
    successful: [0],
    error: [0],
  },
};

const initialState = {
  _id: "",
  win: null,
  team_id: "",
  info: infoState,
  players: {
    away: { ...playerStats },
  },
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
  lineups: {
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
  },
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
      records: [],
    },
  ],
  recording: {
    win: null,
    home: {
      score: 0,
      type: "",
      num: null,
      player: "",
    },
    away: {
      score: 0,
      type: "",
      num: null,
      player: "",
    },
    list: "",
    zone: 0,
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
        const actualRotation = record.sets[setNum].counts.rotation % 6;
        if (actualRotation) {
          const rotatedPlayers = lineups.home.starting.splice(
            0,
            actualRotation
          );
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
    setStatus: (state, action) => {
      const status = action.payload;
      state.status = {
        ...state.status,
        ...status,
      };
    },
    setRecordingPlayer: (state, action) => {
      if (action.payload._id === state.recording.home.player) {
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
            player: action.payload._id,
            score: state.status.scores.home,
          },
          away: {
            ...initialState.recording.away,
            score: state.status.scores.away,
          },
          list: action.payload.list,
          zone: action.payload.zone,
        };
      }
    },
    setRecordingOursType: (state, action) => {
      const { win, type, num, outcome } = action.payload.type;
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
          type: rallyOutcomes[outcome[0]].type,
          num: outcome[0],
        },
      };
    },
    setRecordingOppoType: (state, action) => {
      const { type, num } = action.payload.type;
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
      state.sets[setNum].records[rallyNum] = state.recording;
      if (state.recording.win === true) {
        state.status.scores.home += 1;
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
          state.status.isServing = true;
        }
      } else if (state.recording.win === false) {
        state.status.scores.away += 1;
        // if (state.recording.away.type !== "oppo-error") {
        //   state.players.away[state.recording.away.type].successful[setNum] += 1;
        // } else {
        //   state.players[state.recording.home.player][
        //     state.recording.home.type
        //   ].error[setNum] += 1;
        // }
        if (state.status.isServing) {
          state.status.isServing = false;
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
      state.status.rallyNum += 1;
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
