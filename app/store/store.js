import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../(protected)/user/user-slice";
import teamReducer from "../(protected)/team/team-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
