import { configureStore } from "@reduxjs/toolkit";

import lineupsReducer from "@/app/store/lineups-slice";
import matchReducer from "@/app/store/match-slice";

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
