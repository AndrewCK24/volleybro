import { createSlice } from "@reduxjs/toolkit";

const playsSlice = createSlice({
	name: "plays",
	initialState: {
		serving: false,
		recordingPlay: {
			scoreOurs: 0,
			scoreOppo: 0,
			win: false,
			playerNum: -1,
			type: "",
			typeNum: -1,
		},
		plays: [],
		lineup: {
			ours: [
				{
					starting: 7,
					substitute: 0,
					isSub: false,
					inOutArr: [0, 0],
				},
				{
					starting: 14,
					substitute: 0,
					isSub: false,
					inOutArr: [0, 0],
				},
				{
					starting: 17,
					substitute: 0,
					isSub: false,
					inOnArr: [0, 0],
				},
				{
					starting: 2,
					substitute: 0,
					isSub: false,
					inOutArr: [0, 0],
				},
				{
					starting: 16,
					substitute: 0,
					isSub: false,
					inOutArr: [0, 0],
				},
				{
					starting: 24,
					substitute: 0,
					isSub: false,
					inOutArr: [0, 0],
				},
			],
			opponent: [],
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
				};
				return;
			}
			if (state.plays.length === 0) {
				state.recordingPlay = {
					...state.recordingPlay,
					...action.payload,
					scoreOurs: action.payload.win ? 1 : 0,
					scoreOppo: action.payload.win ? 0 : 1,
				};
				return;
			}
			if (action.payload.win) {
				state.recordingPlay = {
					...state.recordingPlay,
					...action.payload,
					scoreOurs: state.plays[state.plays.length - 1].scoreOurs + 1,
					scoreOppo: state.plays[state.plays.length - 1].scoreOppo,
				};
			} else {
				state.recordingPlay = {
					...state.recordingPlay,
					...action.payload,
					scoreOurs: state.plays[state.plays.length - 1].scoreOurs,
					scoreOppo: state.plays[state.plays.length - 1].scoreOppo + 1,
				};
			}
		},
		recordPlays: (state) => {
			const play = state.recordingPlay;
			state.plays.push(play);
			state.recordingPlay = {
				scoreOurs: 0,
				scoreOppo: 0,
				win: false,
				playerNum: -1,
				type: "",
				typeNum: -1,
			};
		},
		editPlays: (state, action) => {
			const { id, plays } = action.payload;
			state.plays[id] = plays;
		},
	},
});

export const playsActions = playsSlice.actions;

export default playsSlice.reducer;
