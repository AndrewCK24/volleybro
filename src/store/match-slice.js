import { createSlice } from "@reduxjs/toolkit";

const matchSlice = createSlice({
  name: "match",
  initialState: {
    sets: [],
    playersInfo: [
      // TODO: 需考慮修改某筆紀錄時，如何更新 points array
      {number: 7, points: Array(10).fill(0)},
    ],
  },
  reducers: {
    
  }
})