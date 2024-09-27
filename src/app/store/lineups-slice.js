import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: {
    edited: false,
    lineupNum: 0,
    optionMode: "",
    editingMember: {
      _id: null,
      list: "",
      zone: null,
    },
  },
  lineups: [],
};

const lineupsSlice = createSlice({
  name: "lineups",
  initialState,
  reducers: {
    initialize: (state, action) => {
      const lineups = action.payload;
      return {
        ...state,
        status: initialState.status,
        lineups,
      };
    },
    rotateLineup: (state) => {
      const { lineupNum } = state.status;
      state.status.edited = true;
      const newStarting = state.lineups[lineupNum].starting.slice(1);
      newStarting.push(state.lineups[lineupNum].starting[0]);
      state.lineups[lineupNum].starting = newStarting;
    },
    setLineupNum: (state, action) => {
      state.status.lineupNum = action.payload;
    },
    setOptionMode: (state, action) => {
      const mode = action.payload;
      state.status.optionMode = mode;
      if (!mode) {
        state.status.editingMember = initialState.status.editingMember;
      }
    },
    setLiberoSwitch: (state, action) => {
      const { lineupNum } = state.status;
      const { mode, position } = action.payload;
      state.lineups[lineupNum].options.liberoSwitchMode = mode;
      state.lineups[lineupNum].options.liberoSwitchPosition = position;
      state.status.edited = true;
    },
    setEditingPlayer: (state, action) => {
      const { _id, list, zone } = action.payload;
      if (
        list === state.status.editingMember.list &&
        zone === state.status.editingMember.zone
      ) {
        state.status.editingMember = initialState.status.editingMember;
        state.status.optionMode = "";
      } else {
        state.status.editingMember = {
          _id,
          list,
          zone,
        };
        state.status.optionMode = _id ? "playerInfo" : "substitutes";
      }
    },
    removeEditingPlayer: (state) => {
      const { lineupNum } = state.status;
      const { list, zone } = state.status.editingMember;
      if (list === "starting") {
        state.lineups[lineupNum].starting[zone - 1] = {
          ...state.lineups[lineupNum][list][zone - 1],
          _id: null,
        };
      } else {
        state.lineups[lineupNum].liberos.splice(zone - 1, 1);
        if (
          state.lineups[lineupNum].options.liberoSwitchMode >
          state.lineups[lineupNum].liberos.length
        ) {
          state.lineups[lineupNum].options.liberoSwitchMode--;
        }
      }
      state.status = {
        ...state.status,
        edited: true,
        editingMember: initialState.status.editingMember,
        optionMode: initialState.status.optionMode,
      };
    },
    replaceEditingPlayer: (state, action) => {
      const { lineupNum } = state.status;
      const { _id, list, zone } = action.payload;
      const editingMember = state.status.editingMember;
      if (list) state.lineups[lineupNum][list].splice(zone - 1, 1);
      if (list && editingMember._id) {
        state.lineups[lineupNum][list].push({ _id: editingMember._id });
      }
      state.lineups[lineupNum][editingMember.list][editingMember.zone - 1] = {
        ...state.lineups[lineupNum][editingMember.list][editingMember.zone - 1],
        _id,
      };
      state.status.edited = true;
      state.status.editingMember._id = _id;
      state.status.optionMode = "playerInfo";
    },
    addSubstitutePlayer: (state, action) => {
      const { lineupNum } = state.status;
      const _id = action.payload;
      state.lineups[lineupNum].substitutes.push({ _id });
      state.status.edited = true;
    },
    removeSubstitutePlayer: (state, action) => {
      const { lineupNum } = state.status;
      const _id = action.payload;
      state.lineups[lineupNum].substitutes = state.lineups[
        lineupNum
      ].substitutes.filter((player) => player._id !== _id);
      state.status.edited = true;
    },
    setPlayerPosition: (state, action) => {
      const { lineupNum, editingMember } = state.status;
      const position = action.payload;
      state.lineups[lineupNum][editingMember.list][editingMember.zone - 1] = {
        ...state.lineups[lineupNum][editingMember.list][editingMember.zone - 1],
        position,
      };
      state.status = {
        ...state.status,
        edited: true,
        lineupNum: state.status.lineupNum,
        optionMode: "playerInfo",
      };
    },
  },
});

export const lineupsActions = lineupsSlice.actions;

export default lineupsSlice.reducer;
