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
    oppo: { ...playerStats },
  },
  sets: [
    {
      win: null,
      meta: {
        firstServe: null,
        rotateCount: 0,
        timeoutCount: 0,
        substituteCount: 0,
        challengeCount: 0,
      },
      records: [],
      lineup: {
        ours: {
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
        oppo: {},
      },
    },
  ],
  recording: {
    win: null,
    ours: {
      score: 0,
      type: "",
      num: null,
      player: "",
    },
    oppo: {
      score: 0,
      type: "",
      num: null,
      player: "",
    },
    list: "",
    zone: 0,
  },
  status: {
    isServing: false,
    scores: {
      ours: 0,
      oppo: 0,
    },
    editingData: {
      isEditing: false,
      setNum: 0,
      recordNum: 0,
    },
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchInfo: (state, action) => {
      const matchInfo = action.payload;
      state.info = {
        ...state.info,
        ...matchInfo,
      };
    },
    configMatchSet: (state, action) => {
      const { setNum } = state.status.editingData;
      const { firstServe, lineup } = action.payload;
      state.sets[setNum].meta.firstServe = firstServe;
      state.status.isServing = firstServe;

      const { starting, liberos } = lineup;
      let backRowMbIndex;
      starting.map((starting, index) => {
        state.sets[setNum].lineup.ours.starting[index].starting = starting._id;
        state.sets[setNum].lineup.ours.starting[index].position =
          starting.position;
        if (
          starting.position === "MB" &&
          (index > 4 || (!firstServe && index === 0))
        ) {
          backRowMbIndex = index;
        }
      });
      liberos.map((libero, index) => {
        state.sets[setNum].lineup.ours.liberos[index].starting = libero._id;
        state.sets[setNum].lineup.ours.liberos[index].position =
          libero.position;
      });
      if (backRowMbIndex) {
        const backRowMb = {
          ...state.sets[setNum].lineup.ours.starting[backRowMbIndex],
        };
        state.sets[setNum].lineup.ours.starting[backRowMbIndex].starting =
          liberos[0]._id;
        state.sets[setNum].lineup.ours.starting[backRowMbIndex].position =
          liberos[0].position;
        state.sets[setNum].lineup.ours.liberos[0].starting = backRowMb.starting;
        state.sets[setNum].lineup.ours.liberos[0].position = backRowMb.position;
      }
    },
    setRecordingPlayer: (state, action) => {
      if (action.payload._id === state.recording.ours.player) {
        state.recording = {
          ...initialState.recording,
          ours: {
            ...initialState.recording.ours,
            score: state.status.scores.ours,
          },
          oppo: {
            ...initialState.recording.oppo,
            score: state.status.scores.oppo,
          },
        };
      } else {
        state.recording = {
          ...initialState.recording,
          ours: {
            ...initialState.recording.ours,
            player: action.payload._id,
            score: state.status.scores.ours,
          },
          oppo: {
            ...initialState.recording.oppo,
            score: state.status.scores.oppo,
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
        ours: {
          ...state.recording.ours,
          score: win ? state.status.scores.ours + 1 : state.status.scores.ours,
          type: type,
          num: num,
        },
        oppo: {
          ...state.recording.oppo,
          score: win ? state.status.scores.oppo : state.status.scores.oppo + 1,
          type: recordTypes[outcome[0]].type,
          num: outcome[0],
        },
      };
    },
    setRecordingOppoType: (state, action) => {
      const { type, num } = action.payload.type;
      if (num === state.recording.oppo.num) {
        state.recording = {
          ...state.recording,
          win: initialState.recording.win,
          ours: {
            ...state.recording.ours,
            score: state.status.scores.ours,
            type: initialState.recording.ours.type,
            num: initialState.recording.ours.num,
          },
          oppo: {
            ...state.recording.oppo,
            score: state.status.scores.oppo,
            type: initialState.recording.oppo.type,
            num: initialState.recording.oppo.num,
          },
        };
      } else {
        state.recording = {
          ...state.recording,
          oppo: {
            ...state.recording.oppo,
            type: type,
            num: num,
          },
        };
      }
    },
    confirmRecording: (state) => {
      const { setNum, recordNum } = state.status.editingData;
      state.sets[setNum].records[recordNum] = state.recording;
      if (state.recording.win === true) {
        state.status.scores.ours += 1;
        if (state.recording.ours.type === "oppo-error") {
          state.players.oppo[state.recording.oppo.type].error[setNum] += 1;
        } else {
          state.players[state.recording.ours.player][
            state.recording.ours.type
          ].successful[setNum] += 1;
        }
        if (!state.status.isServing) {
          const servingPlayer = state.sets[setNum].lineup.ours.starting.shift();
          state.sets[setNum].lineup.ours.starting.push(servingPlayer);
          if (state.sets[setNum].lineup.ours.starting[3].position === "L") {
            const frontRowL = {
              ...state.sets[setNum].lineup.ours.starting[3],
            };
            state.sets[setNum].lineup.ours.starting[3] =
              state.sets[setNum].lineup.ours.liberos[0];
            state.sets[setNum].lineup.ours.liberos[0] = frontRowL;
          }
          state.sets[setNum].meta.rotateCount += 1;
          state.status.isServing = true;
        }
      } else if (state.recording.win === false) {
        state.status.scores.oppo += 1;
        if (state.recording.oppo.type !== "oppo-error") {
          state.players.oppo[state.recording.oppo.type].successful[setNum] += 1;
        } else {
          state.players[state.recording.ours.player][
            state.recording.ours.type
          ].error[setNum] += 1;
        }
        if (state.status.isServing) {
          state.status.isServing = false;
          if (state.sets[setNum].lineup.ours.starting[0].position === "MB") {
            const backRowMb = {
              ...state.sets[setNum].lineup.ours.starting[0],
            };
            state.sets[setNum].lineup.ours.starting[0] =
              state.sets[setNum].lineup.ours.liberos[0];
            state.sets[setNum].lineup.ours.liberos[0] = backRowMb;
          }
        }
      }
      state.status.editingData.recordNum += 1;
      state.recording = {
        ...initialState.recording,
        ours: {
          ...initialState.recording.ours,
          score: state.status.scores.ours,
        },
        oppo: {
          ...initialState.recording.oppo,
          score: state.status.scores.oppo,
        },
      };
    },
  },
});

export const matchActions = matchSlice.actions;

export default matchSlice.reducer;
