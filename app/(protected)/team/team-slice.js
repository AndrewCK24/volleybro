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
      optionMode: "",
      editingMember: {
        _id: null,
        list: "",
        zone: null,
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
    setOptionMode: (state, action) => {
      const mode = action.payload;
      state.editingLineup.status.optionMode = mode;
      if (!mode) {
        state.editingLineup.status.editingMember =
          initialState.editingLineup.status.editingMember;
      }
    },
    setEditingPlayer: (state, action) => {
      const { _id, list, zone } = action.payload;
      if (
        list === state.editingLineup.status.editingMember.list &&
        zone === state.editingLineup.status.editingMember.zone
      ) {
        state.editingLineup.status.editingMember =
          initialState.editingLineup.status.editingMember;
        state.editingLineup.status.optionMode = "";
      } else {
        state.editingLineup.status.editingMember = {
          _id,
          list,
          zone,
        };
        state.editingLineup.status.optionMode = _id
          ? "playerInfo"
          : "substitutes";
      }
    },
    removeEditingPlayer: (state) => {
      const { list, zone } = state.editingLineup.status.editingMember;
      state.editingLineup.status.edited = true;
      state.editingLineup.others.push(state.editingLineup[list][zone - 1]);
      state.editingLineup[list][zone - 1] = { _id: null };
      state.editingLineup.status.editingMember =
        initialState.editingLineup.status.editingMember;
      state.editingLineup.status.optionMode = "";
    },
    replaceEditingPlayer: (state, action) => {
      const { _id, list, zone } = action.payload;
      const editingMember = state.editingLineup.status.editingMember;
      const replacingPlayer = state.editingLineup[list][zone];
      state.editingLineup.status.edited = true;
      state.editingLineup[list].splice(zone, 1);
      if (editingMember._id) {
        state.editingLineup[list].push(
          state.editingLineup[editingMember.list][editingMember.zone - 1]
        );
      }
      state.editingLineup[editingMember.list][editingMember.zone - 1] =
        replacingPlayer;
      state.editingLineup.status.editingMember._id = _id;
      state.editingLineup.status.optionMode = "playerInfo";
    },
    addSubstitutePlayer: (state, action) => {
      const index = action.payload;
      state.editingLineup.status.edited = true;
      state.editingLineup.substitutes.push(state.editingLineup.others[index]);
      state.editingLineup.others.splice(index, 1);
    },
    removeSubstitutePlayer: (state, action) => {
      const index = action.payload;
      state.editingLineup.status.edited = true;
      state.editingLineup.others.push(state.editingLineup.substitutes[index]);
      state.editingLineup.substitutes.splice(index, 1);
    },
    setPlayerPosition: (state, action) => {
      const { editingMember } = state.editingLineup.status;
      const position = action.payload;
      state.editingLineup.status.edited = true;
      if (position === "") {
        if (editingMember.zone <= 6) {
          state.editingLineup.substitutes.push({
            _id: state.editingLineup.starting[editingMember.zone - 1]._id,
          });
          state.editingLineup.starting[editingMember.zone - 1] = {
            _id: null,
          };
        } else {
          state.editingLineup.substitutes.push({
            _id: state.editingLineup.liberos[editingMember.zone - 7]._id,
          });
          state.editingLineup.liberos[editingMember.zone - 7] = {
            _id: null,
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
          if (state.editingLineup.starting[editingMember.zone - 1]._id) {
            state.editingLineup.substitutes.push({
              _id: state.editingLineup.starting[editingMember.zone - 1]._id,
            });
          }
          state.editingLineup.starting[editingMember.zone - 1] = {
            _id: editingMember._id,
          };
        } else {
          if (state.editingLineup.liberos[editingMember.zone - 7]?._id) {
            state.editingLineup.substitutes.push({
              _id: state.editingLineup.liberos[editingMember.zone - 7]._id,
            });
          }
          state.editingLineup.liberos[editingMember.zone - 7] = {
            _id: editingMember._id,
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
