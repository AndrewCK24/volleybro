import { createSlice } from "@reduxjs/toolkit";
import { recordTypes } from "../lib/record-types";

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
        timeoutCount: 0,
        substituteCount: 0,
        challengeCount: 0,
      },
      records: [],
      lineup: {
        home: {
          starting: [
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
          ],
          liberos: [
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
          ],
        },
        away: {},
      },
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
      const record = action.payload;
      const setNum = record.sets.length - 1;
      const rallyNum = record.sets[setNum]?.rallies?.length || 0;
      const inPlay =
        !record.sets[setNum].hasOwnProperty("win") &&
        record.sets[setNum].hasOwnProperty("options");
      state._id = record._id;
      state.status = {
        ...state.status,
        setNum,
        rallyNum,
        inPlay,
      };
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
    configMatchSet: (state, action) => {
      const { setNum } = state.status;
      const { firstServe, lineup } = action.payload;
      state.sets[setNum].meta.firstServe = firstServe;
      state.status.isServing = firstServe;

      const { starting, liberos } = lineup;
      let backRowMbIndex;
      starting.map((starting, index) => {
        state.sets[setNum].lineup.home.starting[index].starting = starting._id;
        state.sets[setNum].lineup.home.starting[index].position =
          starting.position;
        if (
          starting.position === "MB" &&
          (index > 4 || (!firstServe && index === 0))
        ) {
          backRowMbIndex = index;
        }
      });
      liberos.map((libero, index) => {
        state.sets[setNum].lineup.home.liberos[index].starting = libero._id;
        state.sets[setNum].lineup.home.liberos[index].position =
          libero.position;
      });
      if (backRowMbIndex) {
        const backRowMb = {
          ...state.sets[setNum].lineup.home.starting[backRowMbIndex],
        };
        state.sets[setNum].lineup.home.starting[backRowMbIndex].starting =
          liberos[0]._id;
        state.sets[setNum].lineup.home.starting[backRowMbIndex].position =
          liberos[0].position;
        state.sets[setNum].lineup.home.liberos[0].starting = backRowMb.starting;
        state.sets[setNum].lineup.home.liberos[0].position = backRowMb.position;
      }
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
          type: recordTypes[outcome[0]].type,
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
        if (state.recording.home.type === "oppo-error") {
          state.players.away[state.recording.away.type].error[setNum] += 1;
        } else {
          state.players[state.recording.home.player][
            state.recording.home.type
          ].successful[setNum] += 1;
        }
        if (!state.status.isServing) {
          const servingPlayer = state.sets[setNum].lineup.home.starting.shift();
          state.sets[setNum].lineup.home.starting.push(servingPlayer);
          if (state.sets[setNum].lineup.home.starting[3].position === "L") {
            const frontRowL = {
              ...state.sets[setNum].lineup.home.starting[3],
            };
            state.sets[setNum].lineup.home.starting[3] =
              state.sets[setNum].lineup.home.liberos[0];
            state.sets[setNum].lineup.home.liberos[0] = frontRowL;
          }
          state.sets[setNum].meta.rotateCount += 1;
          state.status.isServing = true;
        }
      } else if (state.recording.win === false) {
        state.status.scores.away += 1;
        if (state.recording.away.type !== "oppo-error") {
          state.players.away[state.recording.away.type].successful[setNum] += 1;
        } else {
          state.players[state.recording.home.player][
            state.recording.home.type
          ].error[setNum] += 1;
        }
        if (state.status.isServing) {
          state.status.isServing = false;
          if (state.sets[setNum].lineup.home.starting[0].position === "MB") {
            const backRowMb = {
              ...state.sets[setNum].lineup.home.starting[0],
            };
            state.sets[setNum].lineup.home.starting[0] =
              state.sets[setNum].lineup.home.liberos[0];
            state.sets[setNum].lineup.home.liberos[0] = backRowMb;
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
