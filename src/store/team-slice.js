import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    infos: {
      name: "",
    },
    members: [],
    matches: [],
  },
  reducers: {
    
  }
})

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
