import { configureStore } from "@reduxjs/toolkit";
import lineupsReducer from "@/app/store/lineups-slice";
import recordReducer from "@/lib/features/record/record-slice";
import editingReducer from "@/lib/features/record/editing-slice";

export const makeStore = () => {
  return configureStore({
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
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
