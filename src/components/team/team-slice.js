import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  nickname: "",
  members: [],
  matchIds: [],
  stats: {},
  editingMember: "",
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    loadTeamData: (state, action) => {
      return {
        ...state,
        _id: action.payload._id,
        name: action.payload.name,
        nickname: action.payload.nickname,
        members: action.payload.members,
        matchIds: action.payload.matchIds,
        stats: action.payload.stats,
        editingMember: "",
      };
    },
    resetTeamData: () => {
      return {
        ...initialState,
      };
    },
    createMember: (state) => {
      state.members = state.members.filter((member) => member._id !== "");
      state.members.push({
        info: {
          admin: false,
          email: "",
          userId: "",
        },
        name: "",
        number: null,
        role: "",
        stats: {},
        _id: "",
      });
      state.editingMember = "";
    },
    setMemberEditMode: (state, action) => {
      state.members = state.members.filter((member) => member._id !== "");
      state.editingMember = action.payload;
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
