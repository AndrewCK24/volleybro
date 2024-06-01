import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../(protected)/user/user-slice";
import lineupsReducer from "@/app/store/lineups-slice";
import matchReducer from "../match/match-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    lineups: lineupsReducer,
    match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
