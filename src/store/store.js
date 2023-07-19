import { configureStore } from "@reduxjs/toolkit";

import teamSlice from "./team-slice";
import playSlice from "./play-slice";

const store = configureStore(
  {
    reducer: {
      team: teamSlice,
      play: playSlice,
    },
  }
);

export default store;