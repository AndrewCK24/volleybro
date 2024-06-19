import { configureStore } from "@reduxjs/toolkit";

import lineupsReducer from "@/app/store/lineups-slice";
import matchReducer from "../match/match-slice";

const store = configureStore({
  reducer: {
    lineups: lineupsReducer,
    match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
