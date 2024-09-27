import { configureStore } from "@reduxjs/toolkit";
import lineupsReducer from "@/src/app/store/lineups-slice";
import recordReducer from "@/src/app/store/record-slice";
import editingReducer from "@/src/app/store/editing-slice";

const store = configureStore({
  reducer: {
    lineups: lineupsReducer,
    record: recordReducer,
    editing: editingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
