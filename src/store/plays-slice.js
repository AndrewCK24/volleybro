import { createSlice } from "@reduxjs/toolkit";

const playsSlice = createSlice({
	name: "plays",
	initialState: {
		plays: [
			{
				scoreOurs: 0,
				scoreOppo: 0,
				win: false,
				playerNum: -1,
				playType: "",
			},
		],
		starters: {
			ours: {},
			opponent: {},
		},
	},
	reducers: {
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
