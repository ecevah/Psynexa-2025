import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lineData: [],
  greenBarData: [],
  blueBarData: [],
};

const timeScaleSlice = createSlice({
  name: "timeScale",
  initialState,
  reducers: {
    setTimeScaleData: (state, action) => {
      const { lineData, greenBarData, blueBarData } = action.payload;
      state.lineData = lineData;
      state.greenBarData = greenBarData;
      state.blueBarData = blueBarData;
    },
  },
});

export const { setTimeScaleData } = timeScaleSlice.actions;
export const selectTimeScaleData = (state) => ({
  lineData: state.timeScale.lineData,
  greenBarData: state.timeScale.greenBarData,
  blueBarData: state.timeScale.blueBarData,
});

export default timeScaleSlice.reducer;
