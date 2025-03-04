import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emotions: {
    angry: 20,
    happy: 25,
    depressed: 15,
    sad: 25,
    overenjoyed: 15,
  },
};

const emotionDoughnutSlice = createSlice({
  name: "emotionDoughnut",
  initialState,
  reducers: {
    setEmotionData: (state, action) => {
      state.emotions = action.payload;
    },
    updateEmotionValue: (state, action) => {
      const { emotion, value } = action.payload;
      if (state.emotions.hasOwnProperty(emotion)) {
        state.emotions[emotion] = value;
      }
    },
  },
});

export const { setEmotionData, updateEmotionValue } =
  emotionDoughnutSlice.actions;

export const selectEmotionData = (state) => state.emotionDoughnut.emotions;

export default emotionDoughnutSlice.reducer;
