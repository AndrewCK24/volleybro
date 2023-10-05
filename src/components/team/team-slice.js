import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
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
      const { _id } = action.payload;
      state.editingMember = _id;
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
