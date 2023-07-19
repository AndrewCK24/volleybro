import { createSlice } from "@reduxjs/toolkit";

const playsSlice = createSlice({
  name: "plays",
  initialState: {
    plays: [],
    starters: {
      ours: {},
      opponent: {},
    }
  },
  reducers: {
    recordPlays: (state, action) => {
      const plays = action.payload;
      state.plays.push(plays);
    },
    editPlays: (state, action) => {
      const {id, plays} = action.payload;
      state.plays[id] = plays;
    }
  }
})

export const playsActions = playSlice.actions;

export default playsSlice.reducer;