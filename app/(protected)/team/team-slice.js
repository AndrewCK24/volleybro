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
    status: {
      editingZone: null,
      editingMember: {
        _id: null,
        number: null,
      },
    },
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
          status: initialState.editingLineup.status,
          starters: teamData.lineup.starters,
          liberos: teamData.lineup.liberos,
          benches,
        },
        matches: teamData.matches,
        stats: teamData.stats,
      };
    },
    updateTeamOnly: (state, action) => {
      state.name = action.payload.name;
      state.nickname = action.payload.nickname;
      state.lineup = action.payload.lineup;
      state.editingLineup = {
        edited: initialState.editingLineup.edited,
        status: initialState.editingLineup.status,
        starters: action.payload.lineup.starters,
        liberos: action.payload.lineup.liberos,
        benches: action.payload.lineup.benches,
      };
      state.matches = action.payload.matches;
      state.stats = action.payload.stats;
    },
    resetTeam: () => {
      return {
        ...initialState,
      };
    },
    rotateLineupCw: (state) => {
      state.editingLineup.edited = true;
      const newStarters = state.editingLineup.starters.slice(1);
      newStarters.push(state.editingLineup.starters[0]);
      state.editingLineup.starters = newStarters;
    },
    rotateLineupCcw: (state) => {
      state.editingLineup.edited = true;
      const newStarters = state.editingLineup.starters.slice(0, -1);
      newStarters.unshift(state.editingLineup.starters[5]);
      state.editingLineup.starters = newStarters;
    },
    setEditingStatus: (state, action) => {
      const { zone, member } = action.payload;
      const { editingZone, editingMember } = state.editingLineup.status;
      if (zone) {
        if (editingZone && editingZone !== zone && !editingMember._id) {
          if (zone <= 6) {
            const player = state.editingLineup.starters[zone - 1].member_id;
            if (editingZone <= 6) {
              state.editingLineup.starters[zone - 1].member_id =
                state.editingLineup.starters[editingZone - 1].member_id;
              state.editingLineup.starters[editingZone - 1].member_id = player;
            } else {
              state.editingLineup.starters[zone - 1].member_id =
                state.editingLineup.liberos[editingZone - 7].member_id;
              state.editingLineup.liberos[editingZone - 7].member_id = player;
            }
          } else {
            const player = state.editingLineup.liberos[zone - 7].member_id;
            if (editingZone <= 6) {
              state.editingLineup.liberos[zone - 7].member_id =
                state.editingLineup.starters[editingZone - 1].member_id;
              state.editingLineup.starters[editingZone - 1].member_id = player;
            } else {
              state.editingLineup.liberos[zone - 7].member_id =
                state.editingLineup.liberos[editingZone - 7].member_id;
              state.editingLineup.liberos[editingZone - 7].member_id = player;
            }
          }
          state.editingLineup.edited = true;
          state.editingLineup.status.editingZone = null;
          state.editingLineup.status.editingMember = {
            _id: null,
            number: null,
          };
          return;
        }
        state.editingLineup.status.editingZone =
          editingZone !== zone ? zone : null;
        state.editingLineup.status.editingMember = {
          _id: null,
          number: null,
        };
      }
      if (member) {
        state.editingLineup.status.editingMember = {
          _id: member._id,
          number: member.number,
        };
      }
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
      state.editingLineup.status = initialState.editingLineup.status;
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
      state.editingLineup.status = initialState.editingLineup.status;
    },
    resetEditingLineup: (state) => {
      state.editingLineup = {
        edited: false,
        status: initialState.editingLineup.status,
        starters: state.lineup.starters,
        liberos: state.lineup.liberos,
        benches: state.lineup.benches,
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
