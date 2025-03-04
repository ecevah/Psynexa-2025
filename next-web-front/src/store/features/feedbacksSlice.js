import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      id: 1,
      text: "initialMessage",
      isBot: true,
      time: "09:30",
    },
    {
      id: 2,
      text: "initialMessage",
      isBot: false,
      time: "09:30",
    },
    {
      id: 3,
      text: "initialMessage",
      isBot: true,
      time: "09:30",
    },
    {
      id: 4,
      text: "initialMessage",
      isBot: false,
      time: "09:30",
    },
    {
      id: 5,
      text: "initialMessage",
      isBot: true,
      time: "09:30",
    },
  ],
  chartData: [
    { positive: 95, negative: -45 },
    { positive: 85, negative: -35 },
    { positive: 75, negative: -55 },
    { positive: 90, negative: -40 },
    { positive: 70, negative: -30 },
    { positive: 85, negative: -45 },
    { positive: 95, negative: -35 },
    { positive: 80, negative: -50 },
    { positive: 75, negative: -45 },
    { positive: 85, negative: -35 },
    { positive: 90, negative: -40 },
    { positive: 95, negative: -35 },
  ],
  totals: {
    positive: 1030, // Toplam positive değeri
    negative: 490, // Toplam negative değeri (mutlak değer)
  },
  feedbackData: [
    {
      id: 1,
      content: "The session was very helpful and insightful.",
      situation: "positive",
      dateTime: "2024-01-15 14:30",
    },
    {
      id: 2,
      content: "I didn't find this session particularly useful.",
      situation: "negative",
      dateTime: "2024-01-14 15:45",
    },
    {
      id: 3,
      content: "Great experience with the therapist.",
      situation: "positive",
      dateTime: "2024-01-13 11:20",
    },
    {
      id: 4,
      content: "The connection was poor during the session.",
      situation: "negative",
      dateTime: "2024-01-12 09:15",
    },
  ],
};

const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setChartData: (state, action) => {
      state.chartData = action.payload;
      // ChartData güncellendiğinde totalleri de güncelle
      state.totals = {
        positive: action.payload.reduce((acc, data) => acc + data.positive, 0),
        negative: action.payload.reduce(
          (acc, data) => acc + Math.abs(data.negative),
          0
        ),
      };
    },
    setFeedbackData: (state, action) => {
      state.feedbackData = action.payload;
    },
    setTotals: (state, action) => {
      state.totals = action.payload;
    },
  },
});

export const { setMessages, setChartData, setFeedbackData, setTotals } =
  feedbacksSlice.actions;

export const selectMessages = (state) => state.feedbacks.messages;
export const selectChartData = (state) => state.feedbacks.chartData;
export const selectFeedbackData = (state) => state.feedbacks.feedbackData;
export const selectTotals = (state) => state.feedbacks.totals;

export default feedbacksSlice.reducer;
