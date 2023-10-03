import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  members: [],
  matchIds: [],
  stats: {},
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
      };
    },
    resetTeamData: () => {
      return {
        ...initialState,
      };
    },
    createMember: (state) => {
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
        isNew: true,
        isEditing: true,
      });
    },
    setMemberEditMode: (state, action) => {
      const { index, isEditing } = action.payload;
      const { isNew } = state.members[index];
      if (!isEditing && isNew) {
        return {
          ...state,
          members: [...state.members.slice(0, index)],
        };
      }
      state.members[index].isEditing = isEditing;
    },
    deleteMember: (state, action) => {
      const { index } = action.payload;
      return {
        ...state,
        members: [
          ...state.members.slice(0, index),
          ...state.members.slice(index + 1),
        ],
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
