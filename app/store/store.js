import { configureStore } from "@reduxjs/toolkit";
import lineupsReducer from "@/app/store/lineups-slice";
import recordReducer from "@/app/store/record-slice";

const store = configureStore({
  reducer: {
    lineups: lineupsReducer,
    record: recordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
