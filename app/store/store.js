import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../user/user-slice";
import teamReducer from "../team/team-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;