import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    infos: {
      name: "",
    },
    members: [
      {
        number: 7,
        name: "曾立維",
        role: "S",
      },
      {
        number: 14,
        name: "賴博劭",
        role: "OH",
      },
      {
        number: 17,
        name: "黃震康",
        role: "MB",
      },
      {
        number: 2,
        name: "許瑋哲",
        role: "OP",
      },
      {
        number: 16,
        name: "朱易",
        role: "OH",
      },
      {
        number: 24,
        name: "莊予樂",
        role: "MB",
      },
      {
        number: 12,
        name: "許凱勛",
        role: "L",
      }
    ],
    matches: [],
  },
  reducers: {
    
  }
})

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
