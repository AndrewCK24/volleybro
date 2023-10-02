import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const rootActions = rootSlice.actions;

export default rootSlice.reducer;