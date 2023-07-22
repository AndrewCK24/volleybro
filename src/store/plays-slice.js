import { createSlice } from "@reduxjs/toolkit";

const playsSlice = createSlice({
	name: "plays",
	initialState: {
		recordingPlay: {
			scoreOurs: 0,
			scoreOppo: 0,
			win: false,
			playerNum: -1,
			type: "",
			typeNum: -1,
		},
		plays: [
			{
				scoreOurs: 0,
				scoreOppo: 0,
				win: false,
				playerNum: -1,
				type: "",
				typeNum: -1,
			},
		],
		starters: {
			ours: {},
			opponent: {},
		},
	},
	reducers: {
		setPlayerOfPlay: (state, action) => {
			if (action.payload.playerNum === state.recordingPlay.playerNum) {
				state.recordingPlay = {
					...state.recordingPlay,
					playerNum: -1,
					typeNum: -1,
				};
			} else {
				state.recordingPlay = {
					...state.recordingPlay,
					playerNum: action.payload.playerNum,
					typeNum: -1,
				};
			}
		},
		setRecordOfPlay: (state, action) => {
			if (action.payload.typeNum === state.recordingPlay.typeNum) {
				state.recordingPlay = {
					...state.recordingPlay,
					typeNum: -1,
				}
				return;
			} 
			if (action.payload.win) {
				state.recordingPlay = {
					...state.recordingPlay,
					...action.payload,
					scoreOurs: state.plays[state.plays.length - 1].scoreOurs + 1,
					scoreOppo: state.plays[state.plays.length - 1].scoreOppo,
				}
			} else {
				state.recordingPlay = {
					...state.recordingPlay,
					...action.payload,
					scoreOurs: state.plays[state.plays.length - 1].scoreOurs,
					scoreOppo: state.plays[state.plays.length - 1].scoreOppo + 1,
				}
			}
		},
		recordPlays: (state, action) => {
			const plays = action.payload;
			state.plays.push(plays);
		},
		editPlays: (state, action) => {
			const { id, plays } = action.payload;
			state.plays[id] = plays;
		},
	},
});

export const playsActions = playsSlice.actions;

export default playsSlice.reducer;
