import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  voicePercentage: 55,
  textPercentage: 45,
};

const speechDoughnutSlice = createSlice({
  name: "speechDoughnut",
  initialState,
  reducers: {
    setSpeechData: (state, action) => {
      const { voicePercentage, textPercentage } = action.payload;
      state.voicePercentage = voicePercentage;
      state.textPercentage = textPercentage;
    },
  },
});

export const { setSpeechData } = speechDoughnutSlice.actions;
export const selectSpeechData = (state) => ({
  voicePercentage: state.speechDoughnut.voicePercentage,
  textPercentage: state.speechDoughnut.textPercentage,
});

export default speechDoughnutSlice.reducer;
