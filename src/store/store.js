import { configureStore } from "@reduxjs/toolkit";

import teamSlice from "./team-slice";
import recordSlice from "./record-slice";

const store = configureStore({
	reducer: {
		team: teamSlice,
		record: recordSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;
