import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin(state, action) {
      state.login = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
