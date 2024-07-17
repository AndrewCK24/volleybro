import { configureStore } from "@reduxjs/toolkit";
import lineupsReducer from "@/app/store/lineups-slice";
import recordReducer from "@/app/store/record-slice";
import editingReducer from "@/app/store/editing-slice";

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
