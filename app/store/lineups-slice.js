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
    initiate: (state, action) => {
      const lineups = action.payload;
      return {
        ...state,
        status: initialState.status,
        lineups: [lineups],
      };
    },
    rotateLineup: (state) => {
      const { lineupNum } = state.status;
      state.status.edited = true;
      const newStarting = state.lineups[lineupNum].starting.slice(1);
      newStarting.push(state.lineups[lineupNum].starting[0]);
      state.lineups[lineupNum].starting = newStarting;
    },
    setOptionMode: (state, action) => {
      const mode = action.payload;
      state.status.optionMode = mode;
      if (!mode) {
        state.status.editingMember = initialState.status.editingMember;
      }
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
      state.status.edited = true;
      state.lineups[lineupNum].others.push(
        state.lineups[lineupNum][list][zone - 1]
      );
      state.lineups[lineupNum][list][zone - 1] = { _id: null };
      state.status.editingMember = initialState.status.editingMember;
      state.status.optionMode = "";
    },
    replaceEditingPlayer: (state, action) => {
      const { lineupNum } = state.status;
      const { _id, list, zone } = action.payload;
      const editingMember = state.status.editingMember;
      const replacingPlayer = state.lineups[lineupNum][list][zone];
      state.status.edited = true;
      state.lineups[lineupNum][list].splice(zone, 1);
      if (editingMember._id) {
        state.lineups[lineupNum][list].push(
          state.lineups[lineupNum][editingMember.list][editingMember.zone - 1]
        );
      }
      state.lineups[lineupNum][editingMember.list][editingMember.zone - 1] =
        replacingPlayer;
      state.status.editingMember._id = _id;
      state.status.optionMode = "playerInfo";
    },
    addSubstitutePlayer: (state, action) => {
      const { lineupNum } = state.status;
      const index = action.payload;
      state.status.edited = true;
      state.lineups[lineupNum].substitutes.push(
        state.lineups[lineupNum].others[index]
      );
      state.lineups[lineupNum].others.splice(index, 1);
    },
    removeSubstitutePlayer: (state, action) => {
      const { lineupNum } = state.status;
      const index = action.payload;
      state.status.edited = true;
      state.lineups[lineupNum].others.push(
        state.lineups[lineupNum].substitutes[index]
      );
      state.lineups[lineupNum].substitutes.splice(index, 1);
    },
    setPlayerPosition: (state, action) => {
      const { lineupNum, editingMember } = state.status;
      const position = action.payload;
      state.status.edited = true;
      if (position === "") {
        if (editingMember.zone <= 6) {
          state.lineups[lineupNum].substitutes.push({
            _id: state.lineups[lineupNum].starting[editingMember.zone - 1]._id,
          });
          state.lineups[lineupNum].starting[editingMember.zone - 1] = {
            _id: null,
          };
        } else {
          state.lineups[lineupNum].substitutes.push({
            _id: state.lineups[lineupNum].liberos[editingMember.zone - 7]._id,
          });
          state.lineups[lineupNum].liberos[editingMember.zone - 7] = {
            _id: null,
          };
        }
        return;
      }
      if (editingMember.zone === 0) {
        if (editingMember.position === "substitutes") {
          state.lineups[lineupNum].others.push(editingMember._id);
          state.lineups[lineupNum].substitutes = state.lineups[
            lineupNum
          ].substitutes.filter((id) => id !== editingMember._id);
        } else if (editingMember.position === "others") {
          state.lineups[lineupNum].substitutes.push(editingMember._id);
          state.lineups[lineupNum].others = state.lineups[
            lineupNum
          ].others.filter((id) => id !== editingMember._id);
        }
      } else {
        if (editingMember.zone <= 6) {
          if (state.lineups[lineupNum].starting[editingMember.zone - 1]._id) {
            state.lineups[lineupNum].substitutes.push({
              _id: state.lineups[lineupNum].starting[editingMember.zone - 1]
                ._id,
            });
          }
          state.lineups[lineupNum].starting[editingMember.zone - 1] = {
            _id: editingMember._id,
          };
        } else {
          if (state.lineups[lineupNum].liberos[editingMember.zone - 7]?._id) {
            state.lineups[lineupNum].substitutes.push({
              _id: state.lineups[lineupNum].liberos[editingMember.zone - 7]._id,
            });
          }
          state.lineups[lineupNum].liberos[editingMember.zone - 7] = {
            _id: editingMember._id,
          };
        }
        state.lineups[lineupNum].substitutes = state.lineups[
          lineupNum
        ].substitutes.filter((id) => id !== editingMember._id);
        state.lineups[lineupNum].others = state.lineups[
          lineupNum
        ].others.filter((id) => id !== editingMember._id);
      }
      state.status = {
        ...initialState.status,
        edited: true,
      };
    },
  },
});

export const lineupsActions = lineupsSlice.actions;

export default lineupsSlice.reducer;
