import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  nickname: "",
  members: [],
  matches: [],
  stats: {},
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (state, action) => {
      return {
        ...state,
        _id: action.payload._id,
        name: action.payload.name,
        nickname: action.payload.nickname,
        members: action.payload.members,
        matchIds: action.payload.matches,
        stats: action.payload.stats,
      };
    },
    resetTeam: () => {
      return {
        ...initialState,
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
