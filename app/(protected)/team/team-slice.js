import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: false,
  _id: "",
  name: "",
  nickname: "",
  members: [],
  lineup: {
    starting: [],
    liberos: [],
    substitutes: [],
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
    starting: [],
    liberos: [],
    substitutes: [],
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

      const substitutes = teamData.members
        .filter((member) => {
          return !teamData.lineup.starting.some((starter) =>
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
          starting: teamData.lineup.starting,
          liberos: teamData.lineup.liberos,
          substitutes: substitutes,
        },
        editingLineup: {
          edited: false,
          status: initialState.editingLineup.status,
          starting: teamData.lineup.starting,
          liberos: teamData.lineup.liberos,
          substitutes: substitutes,
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
        starting: action.payload.lineup.starting,
        liberos: action.payload.lineup.liberos,
        substitutes: action.payload.lineup.substitutes,
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
      const newStarting = state.editingLineup.starting.slice(1);
      newStarting.push(state.editingLineup.starting[0]);
      state.editingLineup.starting = newStarting;
    },
    rotateLineupCcw: (state) => {
      state.editingLineup.edited = true;
      const newStarting = state.editingLineup.starting.slice(0, -1);
      newStarting.unshift(state.editingLineup.starting[5]);
      state.editingLineup.starting = newStarting;
    },
    setEditingStatus: (state, action) => {
      const { zone, member } = action.payload;
      const { editingZone, editingMember } = state.editingLineup.status;
      if (zone) {
        if (editingZone && editingZone !== zone && !editingMember._id) {
          if (zone <= 6) {
            const player = state.editingLineup.starting[zone - 1].member_id;
            if (editingZone <= 6) {
              state.editingLineup.starting[zone - 1].member_id =
                state.editingLineup.starting[editingZone - 1].member_id;
              state.editingLineup.starting[editingZone - 1].member_id = player;
            } else {
              state.editingLineup.starting[zone - 1].member_id =
                state.editingLineup.liberos[editingZone - 7].member_id;
              state.editingLineup.liberos[editingZone - 7].member_id = player;
            }
          } else {
            const player = state.editingLineup.liberos[zone - 7].member_id;
            if (editingZone <= 6) {
              state.editingLineup.liberos[zone - 7].member_id =
                state.editingLineup.starting[editingZone - 1].member_id;
              state.editingLineup.starting[editingZone - 1].member_id = player;
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
        if (state.editingLineup.starting[zone - 1].member_id) {
          state.editingLineup.substitutes.push(
            state.editingLineup.starting[zone - 1].member_id
          );
        }
        state.editingLineup.starting[zone - 1] = { member_id, position };
      } else {
        if (state.editingLineup.liberos[zone - 7].member_id) {
          state.editingLineup.substitutes.push(
            state.editingLineup.liberos[zone - 7].member_id
          );
        }
        state.editingLineup.liberos[zone - 7] = { member_id, position };
      }
      state.editingLineup.substitutes = state.editingLineup.substitutes.filter(
        (id) => id !== member_id
      );
      state.editingLineup.status = initialState.editingLineup.status;
    },
    resetLineupPlayer: (state, action) => {
      const { zone, member_id } = action.payload;
      state.editingLineup.edited = true;
      if (zone <= 6) {
        state.editingLineup.starting[zone - 1] = {
          member_id: null,
        };
      } else {
        state.editingLineup.liberos[zone - 7] = {
          member_id: null,
        };
      }
      state.editingLineup.substitutes.push(member_id);
      state.editingLineup.status = initialState.editingLineup.status;
    },
    resetEditingLineup: (state) => {
      state.editingLineup = {
        edited: false,
        status: initialState.editingLineup.status,
        starting: state.lineup.starting,
        liberos: state.lineup.liberos,
        substitutes: state.lineup.substitutes,
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
