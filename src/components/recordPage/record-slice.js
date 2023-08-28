import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    playerNum: null,
    typeNum: 0,
    win: false,
    scoreOurs: 0,
    scoreOppo: 0,
  },
  status: {
    rotateNum: 0,
    isServing: false,
    position: 0,
    recordingSet: null,
    recordingNum: null,
  },
  setData: {
    records: [],
    lineup: {
      ours: [
        {
          starting: 7,
          substitute: null,
          isSub: false,
          inOutArr: [0, 0],
        },
        {
          starting: 14,
          substitute: null,
          isSub: false,
          inOutArr: [0, 0],
        },
        {
          starting: 17,
          substitute: null,
          isSub: false,
          inOnArr: [0, 0],
        },
        {
          starting: 2,
          substitute: null,
          isSub: false,
          inOutArr: [0, 0],
        },
        {
          starting: 16,
          substitute: null,
          isSub: false,
          inOutArr: [0, 0],
        },
        {
          starting: 24,
          substitute: null,
          isSub: false,
          inOutArr: [0, 0],
        },
      ],
      oppo: [],
    },
    libero: {
      ours: {
        starting: 12,
        substitute: null,
        isSub: false,
        inOutArr: [0, 0],
        receiveOnly: false,
      },
    },
  },
  matchData: {
    team: {
      ours: {
        name: "",
      },
      oppo: {
        name: "",
      },
    },
    sets: [],
  },
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    setRecordingPlayer: (state, action) => {
      if (action.payload.playerNum === state.data.playerNum) {
        state.data = {
          ...initialState.data,
        };
        state.status = {
          ...state.status,
          position: 0,
        };
      } else {
        state.data = {
          ...initialState.data,
          playerNum: action.payload.playerNum,
        };
        state.status = {
          ...state.status,
          position: action.payload.position,
        };
      }
      if (state.status.recordingSet === null) {
        state.status = {
          ...state.status,
          recordingSet: state.matchData.sets.length,
          recordingNum: state.setData.records.length,
        };
      }
    },
    setRecordingDetail: (state, action) => {
      if (action.payload.typeNum === state.data.typeNum) {
        state.data = {
          ...state.data,
          typeNum: 0,
        };
        return;
      }
      const oursPt = action.payload.win ? 1 : 0;
      const oppoPt = action.payload.win ? 0 : 1;
      if (state.status.recordingNum === 0) {
        state.data = {
          ...state.data,
          typeNum: action.payload.typeNum,
          win: action.payload.win,
          scoreOurs: oursPt,
          scoreOppo: oppoPt,
        };
      } else {
        state.data = {
          ...state.data,
          typeNum: action.payload.typeNum,
          win: action.payload.win,
          scoreOurs:
            state.setData.records[state.status.recordingNum - 1].scoreOurs +
            oursPt,
          scoreOppo:
            state.setData.records[state.status.recordingNum - 1].scoreOppo +
            oppoPt,
        };
      }
    },
    createRecord: (state) => {
      state.setData.records.push({
        ...state.data,
        rotateNum: state.status.rotateNum,
      });
      if (state.data.win && !state.status.isServing) {
        state.status = {
          rotateNum: state.status.rotateNum + 1,
          isServing: true,
          position: 0,
          recordingSet: null,
          recordingNum: null,
        };
        const servingPlayer = state.setData.lineup.ours.shift();
        state.setData.lineup.ours.push(servingPlayer);
      } else if (!state.data.win && state.status.isServing) {
        state.status = {
          ...state.status,
          isServing: false,
          position: 0,
          recordingSet: null,
          recordingNum: null,
        };
      } else {
        state.status = {
          ...state.status,
          position: 0,
          recordingSet: null,
          recordingNum: null,
        };
      }
      state.data = {
        ...initialState.data,
      };
    },
  },
});

export const recordActions = recordSlice.actions;

export default recordSlice.reducer;
