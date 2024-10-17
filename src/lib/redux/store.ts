import { configureStore } from "@reduxjs/toolkit";
import lineupReducer from "@/lib/features/team/lineup-slice";
import recordReducer from "@/lib/features/record/record-slice";
import editingReducer from "@/lib/features/record/editing-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      lineup: lineupReducer,
      record: recordReducer,
      editing: editingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
