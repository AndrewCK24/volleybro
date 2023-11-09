import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  nickname: "",
  members: [],
  matches: [],
  stats: {},
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (_, action) => {
      const { teamData, membersData } = action.payload;
      return {
        _id: teamData._id,
        name: teamData.name,
        nickname: teamData.nickname,
        members: membersData,
        matches: teamData.matches,
        stats: teamData.stats,
      };
    },
    resetTeam: () => {
      return {
        ...initialState,
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
