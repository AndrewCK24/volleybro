import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "@/lib/features/global-slice";
import lineupReducer from "@/lib/features/team/lineup-slice";
import recordReducer from "@/lib/features/record/record-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalReducer,
      lineup: lineupReducer,
      record: recordReducer,
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
