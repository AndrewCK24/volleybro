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
    others: [],
  },
  editingLineup: {
    edited: false,
    status: {
      editingZone: null,
      editingMember: {
        _id: null,
        number: null,
        type: "",
      },
    },
    starting: [],
    liberos: [],
    substitutes: [],
    others: [],
  },
  matches: [],
  stats: {},
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (_, action) => {
      // TODO: 修改 /api/teams 的 response，不要返回 userData
      const { userData, teamData, membersData } = action.payload;
      if (!teamData) return;

      const userId = userData._id;
      const admin = membersData.find((member) => member.meta.user_id === userId)
        .meta.admin;
      membersData.sort((a, b) => a.number - b.number);

      return {
        admin,
        _id: teamData._id,
        name: teamData.name,
        nickname: teamData.nickname,
        members: membersData,
        lineup: teamData.lineup,
        editingLineup: {
          ...teamData.lineup,
          edited: false,
          status: initialState.editingLineup.status,
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
        ...action.payload.lineup,
        edited: false,
        status: initialState.editingLineup.status,
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
      const { editingZone, editingMember } = state.editingLineup.status;
      const { zone, member } = action.payload;
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
        if (member.type && !editingZone) {
          state.editingLineup.status.editingZone = 0;
        }
        state.editingLineup.status.editingMember = {
          _id: member._id,
          number: member.number,
          type: member.type || "",
        };
      }
    },
    resetEditingStatus: (state) => {
      state.editingLineup.status = initialState.editingLineup.status;
    },
    setPlayerPosition: (state, action) => {
      const { editingZone, editingMember } = state.editingLineup.status;
      const { position } = action.payload;
      state.editingLineup.edited = true;
      if (editingZone === 0) {
        if (editingMember.type === "substitutes") {
          state.editingLineup.others.push(editingMember._id);
          state.editingLineup.substitutes =
            state.editingLineup.substitutes.filter(
              (id) => id !== editingMember._id
            );
        } else if (editingMember.type === "others") {
          state.editingLineup.substitutes.push(editingMember._id);
          state.editingLineup.others = state.editingLineup.others.filter(
            (id) => id !== editingMember._id
          );
        }
      } else {
        if (editingZone <= 6) {
          if (state.editingLineup.starting[editingZone - 1].member_id) {
            state.editingLineup.substitutes.push(
              state.editingLineup.starting[editingZone - 1].member_id
            );
          }
          state.editingLineup.starting[editingZone - 1] = {
            member_id: editingMember._id,
            position,
          };
        } else {
          if (state.editingLineup.liberos[editingZone - 7].member_id) {
            state.editingLineup.substitutes.push(
              state.editingLineup.liberos[editingZone - 7].member_id
            );
          }
          state.editingLineup.liberos[editingZone - 7] = {
            member_id: editingMember._id,
            position,
          };
        }
        state.editingLineup.substitutes =
          state.editingLineup.substitutes.filter(
            (id) => id !== editingMember._id
          );
        state.editingLineup.others = state.editingLineup.others.filter(
          (id) => id !== editingMember._id
        );
      }
      state.editingLineup.status = initialState.editingLineup.status;
    },
    resetEditingLineup: (state) => {
      state.editingLineup = {
        edited: false,
        status: initialState.editingLineup.status,
        starting: state.lineup.starting,
        liberos: state.lineup.liberos,
        substitutes: state.lineup.substitutes,
        others: state.lineup.others,
      };
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
