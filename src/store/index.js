import { configureStore } from "@reduxjs/toolkit";

import userSlice from "../components/user/user-slice";
import teamSlice from "../components/team/team-slice";
import recordSlice from "../components/record/record-slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    team: teamSlice,
    record: recordSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
