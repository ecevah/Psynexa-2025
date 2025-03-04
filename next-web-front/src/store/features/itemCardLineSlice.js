import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nexabotUsage: {
    value: "100",
    barData: [
      { value: 30 },
      { value: 45 },
      { value: 60 },
      { value: 80 },
      { value: 65 },
      { value: 40 },
      { value: 25 },
    ],
  },
  appUsage: {
    value: "100",
    barData: [
      { value: 30 },
      { value: 45 },
      { value: 60 },
      { value: 80 },
      { value: 65 },
      { value: 40 },
      { value: 25 },
    ],
  },
};

const itemCardLineSlice = createSlice({
  name: "itemCardLine",
  initialState,
  reducers: {
    setNexabotUsage: (state, action) => {
      state.nexabotUsage = action.payload;
    },
    setAppUsage: (state, action) => {
      state.appUsage = action.payload;
    },
  },
});

export const { setNexabotUsage, setAppUsage } = itemCardLineSlice.actions;

export const selectNexabotUsage = (state) => state.itemCardLine.nexabotUsage;
export const selectAppUsage = (state) => state.itemCardLine.appUsage;

export default itemCardLineSlice.reducer;
