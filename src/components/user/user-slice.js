import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  email: "",
  teamIds: [],
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserData(state, action) {
      state.signIn = true;
      state.email = action.payload.email;
      state.teamIds = action.payload.teamIds;
      state._id = action.payload._id;
    },
    signOut(state) {
      state.signIn = false;
      state.email = "";
      state.teamIds = [];
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
