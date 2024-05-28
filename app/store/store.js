import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../(protected)/user/user-slice";
import teamReducer from "@/app/store/team-slice";
import matchReducer from "../match/match-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
    match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
