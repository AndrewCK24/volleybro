import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: false,
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
      const { userData, teamData, membersData } = action.payload;
      const userId = userData._id;
      const admin = membersData.find((member) => member.meta.user_id === userId)
        .meta.admin;
      return {
        admin,
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
