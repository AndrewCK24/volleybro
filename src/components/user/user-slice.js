import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  email: "",
  info:{
    teamIds: [],
    memberIds: [],
  },
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser(state, action) {
      state.email = action.payload.email;
      state.info = action.payload.info;
      state._id = action.payload._id;
      state.signIn = true;
    },
    signOut(state) {
      state.email = "";
      state.info = {
        teamIds: [],
        memberIds: [],
      };
      state._id = "";
      state.signIn = false;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
