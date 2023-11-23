import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: false,
  _id: "",
  name: "",
  nickname: "",
  members: [],
  lineup: {
    starters: [],
    liberos: [],
    benches: [],
  },
  editingLineup: {
    edited: false,
    starters: [],
    liberos: [],
    benches: [],
  },
  matches: [],
  stats: {},
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (_, action) => {
      const { userData, teamData, membersData } = action.payload;
      if (!teamData) return;

      const userId = userData._id;
      const admin = membersData.find((member) => member.meta.user_id === userId)
        .meta.admin;
      membersData.sort((a, b) => a.number - b.number);

      const benches = teamData.members
        .filter((member) => {
          return !teamData.lineup.starters.some((starter) =>
            starter.member_id
              ? starter.member_id.toString() === member.toString()
              : false
          );
        })
        .filter((member) => {
          return !teamData.lineup.liberos.some((libero) =>
            libero.member_id
              ? libero.member_id.toString() === member.toString()
              : false
          );
        });

      return {
        admin,
        _id: teamData._id,
        name: teamData.name,
        nickname: teamData.nickname,
        members: membersData,
        lineup: {
          starters: teamData.lineup.starters,
          liberos: teamData.lineup.liberos,
          benches,
        },
        editingLineup: {
          edited: false,
          starters: teamData.lineup.starters,
          liberos: teamData.lineup.liberos,
          benches,
        },
        matches: teamData.matches,
        stats: teamData.stats,
      };
    },
    resetTeam: () => {
      return {
        ...initialState,
      };
    },
    setLineupPlayer: (state, action) => {
      const { zone, member_id, position } = action.payload;
      state.editingLineup.edited = true;
      if (zone <= 6) {
        if (state.editingLineup.starters[zone - 1].member_id) {
          state.editingLineup.benches.push(
            state.editingLineup.starters[zone - 1].member_id
          );
        }
        state.editingLineup.starters[zone - 1] = { member_id, position };
      } else {
        if (state.editingLineup.liberos[zone - 7].member_id) {
          state.editingLineup.benches.push(
            state.editingLineup.liberos[zone - 7].member_id
          );
        }
        state.editingLineup.liberos[zone - 7] = { member_id, position };
      }

      state.editingLineup.benches = state.editingLineup.benches.filter(
        (id) => id !== member_id
      );
    },
    resetLineupPlayer: (state, action) => {
      const { zone, member_id } = action.payload;
      state.editingLineup.edited = true;
      if (zone <= 6) {
        state.editingLineup.starters[zone - 1] = {
          member_id: null,
        };
      } else {
        state.editingLineup.liberos[zone - 7] = {
          member_id: null,
        };
      }

      state.editingLineup.benches.push(member_id);
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
