import { configureStore } from "@reduxjs/toolkit";

import teamSlice from "./team-slice";
import playsSlice from "./plays-slice";

const store = configureStore(
  {
    reducer: {
      team: teamSlice,
      plays: playsSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  }
);

export default store;