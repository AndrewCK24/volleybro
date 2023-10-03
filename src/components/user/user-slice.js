import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  name: "",
  email: "",
  teams: [],
  invitingTeams: [],
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserData(state, action) {
      state.signIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.teams = action.payload.teams;
      state.invitingTeams = action.payload.invitingTeams;
      state._id = action.payload._id;
      delete state.password;
    },
    startSignUp(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    cancelSignUp(state) {
      state.email = "";
      delete state.password;
    },
    signOut(state) {
      state.signIn = false;
      state.name = "";
      state.email = "";
      state.teams = [];
      state.invitingTeams = [];
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
