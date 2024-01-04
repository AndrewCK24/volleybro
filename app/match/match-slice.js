import { createSlice } from "@reduxjs/toolkit";
import { recordTypes } from "../lib/record-types";

const initialState = {
  _id: "",
  team_id: "",
  recording: {
    win: false,
    ours: {
      score: 0,
      type: "",
      num: null,
      player: {
        _id: "",
        number: null,
      },
    },
    oppo: {
      score: 0,
      type: "",
      num: null,
      player: {
        _id: "",
        number: null,
      },
    },
    zone: 0,
  },
  status: {
    rotateNum: 0,
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
  sets: [
    {
      firstServe: false,
      records: [],
      lineup: {
        ours: {
          starters: [
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
          libero: [
            {
              starting: "",
              substitute: "",
              position: "",
              inOutArr: [null, null],
            },
          ],
          benches: [],
        },
        oppo: {},
      },
    },
  ],
  info: {
    team: {
      ours: {
        name: "",
      },
      oppo: {
        name: "",
      },
    },
    match: {
      name: "",
      formal: false,
      setCount: null,
      finalSetPoint: null,
    },
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    configMatch: (state, action) => {
      const { setNum } = state.status.editingData;
      const {
        teamId,
        firstServe,
        oursName,
        oppoName,
        matchName,
        formalMatch,
        setCount,
        finalSetPoint,
        lineup,
      } = action.payload;
      state.info = {
        team: {
          ours: {
            name: oursName,
          },
          oppo: {
            name: oppoName,
          },
        },
        match: {
          name: matchName,
          formal: formalMatch,
          setCount: setCount,
          finalSetPoint: finalSetPoint,
        },
      };
      if (!state.team_id) state.team_id = teamId;
      state.sets[setNum].firstServe = firstServe;

      const { starters, liberos, benches } = lineup;
      starters.map((starter, index) => {
        state.sets[setNum].lineup.ours.starters[index].starting =
          starter.member_id;
        state.sets[setNum].lineup.ours.starters[index].position =
          starter.position;
      });
      liberos.map((libero, index) => {
        state.sets[setNum].lineup.ours.libero[index].starting =
          libero.member_id;
        state.sets[setNum].lineup.ours.libero[index].position = libero.position;
      });
      benches.map((bench, index) => {
        state.sets[setNum].lineup.ours.benches[index] = bench;
      });
    },
    setRecordingPlayer: (state, action) => {
      if (action.payload.player.number === state.recording.ours.player.number) {
        state.recording = { ...initialState.recording };
      } else {
        state.recording = {
          ...initialState.recording,
          zone: action.payload.zone,
          ours: {
            ...initialState.recording.ours,
            player: {
              _id: action.payload.player._id,
              number: action.payload.player.number,
            },
          },
        };
      }
    },
    setRecordingOursType: (state, action) => {
      const { win, type, num, outcome } = action.payload.type;
      // if (num === state.recording.ours.num) {
      //   state.recording = {
      //     ...initialState.recording,
      //     ours: {
      //       ...initialState.recording.ours,
      //       player: {
      //         _id: state.recording.ours.player._id,
      //         number: state.recording.ours.player.number,
      //       },
      //     },
      //   };
      // } else {
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
      // }
    },
    setRecordingOppoType: (state, action) => {
      const { type, num } = action.payload.type;
      if (num === state.recording.oppo.num) {
        state.recording = {
          ...state.recording,
          oppo: {
            ...state.recording.oppo,
            type: initialState.recording.oppo.type,
            num: initialState.recording.oppo.num,
            score: initialState.recording.oppo.score,
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
      if (state.recording.win) {
        state.status.scores.ours += 1;
        if (!state.status.isServing) {
          state.status.rotateNum += 1;
          state.status.isServing = true;
        }
      } else {
        state.status.scores.oppo += 1;
        if (state.status.isServing) {
          state.status.isServing = false;
        }
      }
      state.status.editingData.recordNum += 1;
      state.recording = { ...initialState.recording };
    },
  },
});

export const matchActions = matchSlice.actions;

export default matchSlice.reducer;