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
    status: {
      stage: "starting",
      edited: false,
      editingMember: {
        zone: null,
        _id: null,
        number: null,
        position: "",
      },
      replacingMember: {
        zone: null,
        _id: null,
        number: null,
        position: "",
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
      state.editingLineup.status.edited = true;
      const newStarting = state.editingLineup.starting.slice(1);
      newStarting.push(state.editingLineup.starting[0]);
      state.editingLineup.starting = newStarting;
    },
    rotateLineupCcw: (state) => {
      state.editingLineup.status.edited = true;
      const newStarting = state.editingLineup.starting.slice(0, -1);
      newStarting.unshift(state.editingLineup.starting[5]);
      state.editingLineup.starting = newStarting;
    },
    setCompositionEditingStage: (state, action) => {
      const stage = action.payload;
      state.editingLineup.status.stage = stage;
    },
    selectCompositionPlayer: (state, action) => {
      const { stage } = state.editingLineup.status;
      const { player, index, origin } = action.payload;
      state.editingLineup.status.edited = true;
      if (stage === origin) {
        state.editingLineup[stage].splice(index, 1);
        state.editingLineup.others.push(player);
      } else {
        state.editingLineup[stage].push(player);
        state.editingLineup[origin].splice(index, 1);
      }
    },
    setEditingStatus: (state, action) => {
      const { editingMember, replacingMember } = state.editingLineup.status;
      const { zone, _id, number, position } = action.payload;
      if (editingMember.zone === null) {
        state.editingLineup.status.editingMember = {
          zone,
          _id,
          number,
          position,
        };
        return;
      }
      if (zone > 0) {
        if (editingMember.zone === zone) {
          state.editingLineup.status = {
            edited: state.editingLineup.status.edited,
            editingMember: initialState.editingLineup.status.editingMember,
            replacingMember: initialState.editingLineup.status.replacingMember,
          };
          return;
        }
        if (
          editingMember.zone &&
          editingMember.zone !== zone &&
          editingMember._id &&
          _id
        ) {
          if (zone <= 6) {
            state.editingLineup.starting[zone - 1] = {
              ...state.editingLineup.starting[zone - 1],
              member_id: editingMember._id,
            };
          } else {
            state.editingLineup.liberos[zone - 7] = {
              ...state.editingLineup.liberos[zone - 7],
              member_id: editingMember._id,
            };
          }
          if (editingMember.zone <= 6) {
            state.editingLineup.starting[editingMember.zone - 1] = {
              ...state.editingLineup.starting[editingMember.zone - 1],
              member_id: _id,
            };
          } else {
            state.editingLineup.liberos[editingMember.zone - 7] = {
              ...state.editingLineup.liberos[editingMember.zone - 7],
              member_id: _id,
            };
          }
          state.editingLineup.status = {
            edited: true,
            editingMember: initialState.editingLineup.status.editingMember,
            replacingMember: initialState.editingLineup.status.replacingMember,
          };
          return;
        } else {
          state.editingLineup.status.editingMember = {
            zone,
            _id,
            number,
            position,
          };
        }
      } else if (zone === 0) {
        if (editingMember._id === _id) {
          state.editingLineup.status = {
            edited: state.editingLineup.status.edited,
            editingMember: initialState.editingLineup.status.editingMember,
            replacingMember: initialState.editingLineup.status.replacingMember,
          };
          return;
        }
        if (editingMember.zone > 0) {
          state.editingLineup.status.replacingMember = {
            zone,
            _id,
            number,
            position: "",
          };
        } else {
          state.editingLineup.status.editingMember = {
            zone,
            _id,
            number,
            position,
          };
        }
      } else {
      }
    },
    resetEditingStatus: (state) => {
      state.editingLineup.status = {
        ...initialState.editingLineup.status,
        edited: state.editingLineup.status.edited,
      };
    },
    setPlayerPosition: (state, action) => {
      const { editingMember, replacingMember } = state.editingLineup.status;
      const position = action.payload;
      state.editingLineup.status.edited = true;
      if (position === "") {
        if (editingMember.zone <= 6) {
          state.editingLineup.substitutes.push(
            state.editingLineup.starting[editingMember.zone - 1].member_id
          );
          state.editingLineup.starting[editingMember.zone - 1] = {
            member_id: null,
            position: "",
          };
        } else {
          state.editingLineup.substitutes.push(
            state.editingLineup.liberos[editingMember.zone - 7].member_id
          );
          state.editingLineup.liberos[editingMember.zone - 7] = {
            member_id: null,
            position: "",
          };
        }
        return;
      }
      if (editingMember.zone === 0) {
        if (editingMember.position === "substitutes") {
          state.editingLineup.others.push(editingMember._id);
          state.editingLineup.substitutes =
            state.editingLineup.substitutes.filter(
              (id) => id !== editingMember._id
            );
        } else if (editingMember.position === "others") {
          state.editingLineup.substitutes.push(editingMember._id);
          state.editingLineup.others = state.editingLineup.others.filter(
            (id) => id !== editingMember._id
          );
        }
      } else {
        if (editingMember.zone <= 6) {
          if (state.editingLineup.starting[editingMember.zone - 1].member_id) {
            state.editingLineup.substitutes.push(
              state.editingLineup.starting[editingMember.zone - 1].member_id
            );
          }
          state.editingLineup.starting[editingMember.zone - 1] = {
            member_id: editingMember._id,
            position,
          };
        } else {
          if (state.editingLineup.liberos[editingMember.zone - 7]?.member_id) {
            state.editingLineup.substitutes.push(
              state.editingLineup.liberos[editingMember.zone - 7].member_id
            );
          }
          state.editingLineup.liberos[editingMember.zone - 7] = {
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
      state.editingLineup.status = {
        ...initialState.editingLineup.status,
        edited: true,
      };
    },
    resetEditingLineup: (state) => {
      state.editingLineup = {
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
