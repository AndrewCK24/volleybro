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
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.signIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.teams = action.payload.teams;
      state.info = action.payload.info;
      state.preferences = action.payload.preferences;
      state._id = action.payload._id;
    },
    signOut: (state) => {
      state.signIn = null;
      state.name = "";
      state.email = "";
      state.teams = {
        joined: [],
        inviting: [],
      };
      state.info = {};
      state.preferences = {};
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
