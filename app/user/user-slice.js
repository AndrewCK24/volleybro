import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  name: "",
  email: "",
  teams: {
    joined: [],
    inviting: [],
  },
  info: {},
  preferences: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.signIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.teams = action.payload.teams;
      state._id = action.payload._id;
    },
    signOut(state) {
      state.signIn = false;
      state.name = "";
      state.email = "";
      state.teams = [];
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
