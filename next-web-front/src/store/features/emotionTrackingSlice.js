import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lineData: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Angry",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#FE7575",
        backgroundColor: "#FE7575",
      },
      {
        label: "Happy",
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: "#FEE278",
        backgroundColor: "#FEE278",
      },
      {
        label: "Depressed",
        data: [45, 55, 65, 45, 70, 45, 60],
        borderColor: "#C179FF",
        backgroundColor: "#C179FF",
      },
      {
        label: "Sad",
        data: [35, 65, 45, 75, 50, 65, 40],
        borderColor: "#64C6EA",
        backgroundColor: "#64C6EA",
      },
      {
        label: "Overenjoyed",
        data: [55, 45, 75, 35, 60, 45, 70],
        borderColor: "#A1DC67",
        backgroundColor: "#A1DC67",
      },
    ],
  },
  barData: {
    labels: ["Angry", "Happy", "Depressed", "Sad", "Overenjoyed"],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        backgroundColor: [
          "#FE7575",
          "#FEE278",
          "#C179FF",
          "#64C6EA",
          "#A1DC67",
        ],
        borderRadius: 10,
      },
    ],
  },
  testTableData: {
    items: [
      {
        id: 1,
        testName: "Depression Test",
        date: "12.03.2024",
        score: 85,
        status: "completed",
      },
      {
        id: 2,
        testName: "Anxiety Test",
        date: "11.03.2024",
        score: 92,
        status: "completed",
      },
      {
        id: 3,
        testName: "Stress Test",
        date: "10.03.2024",
        score: 78,
        status: "completed",
      },
    ],
  },
  contentsData: {
    items: [
      {
        id: 1,
        title: "Meditation Session",
        date: "12.03.2024",
        duration: "30 min",
        type: "meditation",
        status: "completed",
      },
      {
        id: 2,
        title: "Breathing Exercise",
        date: "11.03.2024",
        duration: "15 min",
        type: "exercise",
        status: "completed",
      },
      {
        id: 3,
        title: "Mindfulness Practice",
        date: "10.03.2024",
        duration: "20 min",
        type: "mindfulness",
        status: "completed",
      },
    ],
  },
};

const emotionTrackingSlice = createSlice({
  name: "emotionTracking",
  initialState,
  reducers: {
    setLineData: (state, action) => {
      state.lineData = action.payload;
    },
    setBarData: (state, action) => {
      state.barData = action.payload;
    },
    setTestTableData: (state, action) => {
      state.testTableData = action.payload;
    },
    setContentsData: (state, action) => {
      state.contentsData = action.payload;
    },
    updateTestTableItem: (state, action) => {
      const { id, ...updates } = action.payload;
      const item = state.testTableData.items.find((item) => item.id === id);
      if (item) {
        Object.assign(item, updates);
      }
    },
    updateContentsItem: (state, action) => {
      const { id, ...updates } = action.payload;
      const item = state.contentsData.items.find((item) => item.id === id);
      if (item) {
        Object.assign(item, updates);
      }
    },
  },
});

export const {
  setLineData,
  setBarData,
  setTestTableData,
  setContentsData,
  updateTestTableItem,
  updateContentsItem,
} = emotionTrackingSlice.actions;

export const selectLineData = (state) => state.emotionTracking.lineData;
export const selectBarData = (state) => state.emotionTracking.barData;
export const selectTestTableData = (state) =>
  state.emotionTracking.testTableData;
export const selectContentsData = (state) => state.emotionTracking.contentsData;

export default emotionTrackingSlice.reducer;
