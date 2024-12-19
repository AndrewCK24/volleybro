import {
  createSlice,
  type CaseReducer,
  type PayloadAction,
} from "@reduxjs/toolkit";

type GlobalState = {
  refresh: { isRefreshing: boolean; isPulling: boolean };
};

const initialState: GlobalState = {
  refresh: { isRefreshing: false, isPulling: false },
};

const setIsRefreshing: CaseReducer<GlobalState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.refresh.isRefreshing = action.payload;
};

const setIsPulling: CaseReducer<GlobalState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.refresh.isPulling = action.payload;
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsRefreshing,
    setIsPulling,
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
